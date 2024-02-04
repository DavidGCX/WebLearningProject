const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const usersRouter = express.Router();

usersRouter.post('/signup', authController.signup);
usersRouter.post('/login', authController.login);

usersRouter.post('/forgetPassword', authController.forgetPassword);
usersRouter.patch('/resetPassword/:resetToken', authController.resetPassword);

usersRouter
	.route('/')
	.get(userController.getUsers)
	.post(userController.createUser);
usersRouter
	.route('/:id')
	.get(userController.getUser)
	.patch(userController.patchUser)
	.delete(userController.deleteUser);
module.exports = usersRouter;
