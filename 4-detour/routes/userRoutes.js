const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const usersRouter = express.Router();

usersRouter.post('/signup', authController.signup);
usersRouter.post('/login', authController.login);

usersRouter.post('/forgetPassword', authController.forgetPassword);
usersRouter.patch('/resetPassword/:resetToken', authController.resetPassword);
usersRouter.patch(
	'/updateMyPassword',
	authController.protect,
	authController.updatePassword,
);
usersRouter.patch('/updateMe', authController.protect, userController.updateMe);
usersRouter.delete(
	'/deleteMe',
	authController.protect,
	userController.deleteMe,
);
usersRouter
	.route('/')
	.get(userController.getUsers)
	.post(
		authController.protect,
		authController.restrictTo('admin'),
		userController.createUser,
	);
usersRouter
	.route('/:id')
	.get(userController.getUser)
	.patch(
		authController.protect,
		authController.restrictTo('admin'),
		userController.patchUser,
	)
	.delete(
		authController.protect,
		authController.restrictTo('admin'),
		userController.deleteUser,
	);
module.exports = usersRouter;
