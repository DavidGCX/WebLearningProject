const express = require('express');
const toursRouter = express.Router();
const tourController = require('../controllers/tourController');
// Check ID exist
// toursRouter.param('id', tourController.checkID);
toursRouter
	.route('/')
	.get(tourController.getAllTours)
	.post(tourController.createTour);
toursRouter
	.route('/top-5-cheap')
	.get(tourController.aliasTopTours, tourController.getAllTours);
toursRouter
	.route('/:id')
	.get(tourController.getTour)
	.patch(tourController.patchTour)
	.delete(tourController.deleteTour);

module.exports = toursRouter;
const a = 1;
