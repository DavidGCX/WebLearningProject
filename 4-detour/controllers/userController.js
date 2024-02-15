const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
	// Object.key does not work need to change method
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				'THis route is not for password updates. Please use/updateMyPassword',
				400,
			),
		);
	}
	// filter out unwanted fields names that are not allowed to be updated
	const filteredBody = filterObj(req.body, 'name', 'email');
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		// return the new object
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser,
		},
	});
});

exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });
	res.status(204).json({
		status: 'success',
		data: null,
	});
});

exports.createUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not defined! Please use /signup instead',
	});
};
exports.getUsers = Factory.getAll(User);
exports.getUser = Factory.getOne(User);
// Do NOT update passwords with this!
exports.patchUser = Factory.updateOne(User);
exports.deleteUser = Factory.deleteOne(User);
