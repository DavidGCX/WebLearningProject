const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');

exports.signup = catchAsync(async (req, res, next) => {
	// This is a dangerous way to create a user
	//const newUser = await User.create(req.body);
	// Instead, we should create a new object and then save it
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
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
});
