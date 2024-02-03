const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
}


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

	const token = signToken(newUser._id);
	res.status(201).json({
		status: 'success',
		token,
		data: {
			user: newUser,
		},
	});
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	// 1) Check if email and password exist
	if (!email || !password) {
		return next(new AppError('Please provide email and password!', 400));
	}

	const user = await User.findOne({ email }).select('+password');
	if (!user || !(await user.correctPassword(password))) {
		return next(new AppError('Incorrect email or password', 401));
	}
	const token = signToken(user._id);
	res.status(200).json({
		status: 'success',
		token,
	});
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new AppError('There is no user with email address', 404));
	}
	
});

exports.resetPassword = (req, res, next) => {
};

exports.protect = catchAsync(async (req, res, next) => {
	if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
		return next(new AppError('You are not logged in! Please log in to get access', 401));
	}
	const token = req.headers.authorization.split(' ')[1];
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(new AppError('The user belonging to this token does no longer exist.', 401));
	}
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(new AppError('User recently changed password! Please log in again.', 401));
	}
	req.user = currentUser;
	next();
})

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new AppError('You do not have permission to perform this action', 403));
		}
		next();
	}
}