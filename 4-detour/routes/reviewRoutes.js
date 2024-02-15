const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
	.route('/')
	.post(
		authController.protect,
		authController.restrictTo('user'),
		reviewController.createReview,
	)
	.get(reviewController.getAllReview);
reviewRouter
	.route('/:id')
	.get(reviewController.getReview)
	.patch(reviewController.updateReview)
	.delete(reviewController.deleteReview);

module.exports = reviewRouter;
