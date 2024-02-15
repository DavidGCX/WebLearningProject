const express = require('express');
const authController = require('../controllers/authController');

const toursRouter = express.Router();
const tourController = require('../controllers/tourController');
const reviewRouter = require('./reviewRoutes');
// re route to reviewRouter
toursRouter.use('/:tourId/reviews', reviewRouter);

// Check ID exist
// toursRouter.param('id', tourController.checkID);
toursRouter
	.route('/')
	.get(authController.protect, tourController.getAllTours)
	.post(tourController.createTour);
toursRouter
	.route('/top-5-cheap')
	.get(
		authController.protect,
		tourController.aliasTopTours,
		tourController.getAllTours,
	);
toursRouter
	.route('/tour-stats')
	.get(authController.protect, tourController.getTourStats);
toursRouter
	.route('/monthly-plan/:year')
	.get(authController.protect, tourController.getMonthlyPlan);
toursRouter
	.route('/:id')
	.get(tourController.getTour)
	.patch(tourController.updateTour)
	.delete(
		authController.protect,
		authController.restrictTo('admin', 'lead-guide'),
		tourController.deleteTour,
	);

module.exports = toursRouter;
