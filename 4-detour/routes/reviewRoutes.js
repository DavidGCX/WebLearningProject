const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
	.route('/')
	.post(
		authController.protect,
		authController.restrictTo('user'),
		reviewController.setTourUserIds,
		reviewController.createReview,
	)
	.get(reviewController.getAllReview);
reviewRouter
	.route('/:id')
	.get(
		authController.protect,
		authController.restrictTo('admin', 'user'),
		reviewController.getReview,
	)
	.patch(
		authController.protect,
		authController.restrictTo('admin', 'user'),
		reviewController.updateReview,
	)
	.delete(
		authController.protect,
		authController.restrictTo('admin', 'user'),
		reviewController.deleteReview,
	);

module.exports = reviewRouter;
