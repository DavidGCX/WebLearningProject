const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const sendEmail = require('../utils/email');

const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN_DAY * 24 * 60 * 60 * 1000,
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
	user.password = undefined;
	res.cookie('jwt', token, cookieOptions);
	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

exports.logout = (req, res) => {
	res.cookie('jwt', 'loggedout', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});
	res.status(200).json({ status: 'success' });
};

exports.signup = catchAsync(async (req, res, next) => {
	// This is a dangerous way to create a user
	//const newUser = await User.create(req.body);
	// Instead, we should create a new object and then save it
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		passwordChangedAt: Date.now(),
	});

	createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	// 1) Check if email and password exist
	if (!email || !password) {
		return next(new AppError('Please provide email and password!', 400));
	}

	const user = await User.findOne({ email })
		.select('+password')
		.select('+IntervalRecordLogin');
	if (!user) {
		return next(new AppError('Email Not Exist', 401));
	}

	if (!(await user.correctPassword(password))) {
		user.recordLogin(req.ip, false);
		if (!user.loginAttempt()) {
			await user.save({ validateBeforeSave: false });
			return next(
				new AppError(
					'You have reached the maximum number of login attempts or login too frequent. Please try again later!',
					429,
				),
			);
		}
		await user.save({ validateBeforeSave: false });
		return next(new AppError('Incorrect email or password', 401));
	}
	user.recordLogin(req.ip, true);
	if (!user.loginAttempt()) {
		await user.save({ validateBeforeSave: false });
		return next(
			new AppError('You login too frequent. Please try again later!', 429),
		);
	}
	await user.save({ validateBeforeSave: false });
	// Do not wish to send to the client but need to keep the information
	user.IntervalRecordLogin = undefined;
	user.loginAttempts = undefined;
	createSendToken(user, 200, res);
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
	const user = await User.findOne({
		email: req.body.email,
	}).select('+password');
	if (!user) {
		return next(new AppError('There is no user with email address', 404));
	}
	const resetToken = user.createPasswordResetToken();
	// another way to pass validation is user.save({validateBeforeSave: false});
	user.save({ validateBeforeSave: false });

	const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
	const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
	try {
		await sendEmail({
			email: user.email,
			subject: 'Your password reset token (valid for 10 min)',
			message,
		});
		// TODO：Remove resetToken Sent to the client
		res.status(200).json({
			status: 'success',
			message: 'Token sent to email!',
			resetToken,
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });
		return next(
			new AppError(
				'There was an error sending the email. Try again later!',
				500,
			),
		);
	}
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	const { resetToken } = req.params.resetToken;
	const hashedToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	if (!user) {
		return next(new AppError('Token is invalid or has expired', 400));
	}
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();
	createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password');

	if (!(await user.correctPassword(req.body.passwordCurrent))) {
		return next(new AppError('Your current password is wrong', 401));
	}
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	await user.save();
	createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	} else {
		return next(
			new AppError('You are not logged in! Please log in to get access', 401),
		);
	}

	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(
			new AppError(
				'The user belonging to this token does no longer exist.',
				401,
			),
		);
	}
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError('User recently changed password! Please log in again.', 401),
		);
	}
	if (!currentUser.photo) {
		currentUser.photo = 'default.jpg';
	}
	req.user = currentUser;
	res.locals.user = currentUser;
	next();
});
// only for rendered pages, no errors
exports.isLoggedIn = async (req, res, next) => {
	if (req.cookies.jwt) {
		try {
			const token = req.cookies.jwt;
			const decoded = await promisify(jwt.verify)(
				token,
				process.env.JWT_SECRET,
			);
			const currentUser = await User.findById(decoded.id);
			if (!currentUser) {
				return next();
			}
			if (currentUser.changedPasswordAfter(decoded.iat)) {
				return next();
			}
			if (!currentUser.photo) {
				currentUser.photo = 'default.jpg';
			}
			res.locals.user = currentUser;
			return next();
		} catch (err) {
			// no login user
			return next();
		}
	}
	next();
};

exports.restrictTo =
	(...roles) =>
	(req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError('You do not have permission to perform this action', 403),
			);
		}
		next();
	};
