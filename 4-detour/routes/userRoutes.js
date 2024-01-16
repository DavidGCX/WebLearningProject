const express = require('express');
const userController = require('../controllers/userController');
const usersRouter = express.Router();

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
