const express = require('express');
const toursRouter = express.Router();
const tourController = require('../controllers/tourController');

toursRouter
	.route('/')
	.get(tourController.getTours)
	.post(tourController.createTour);
toursRouter
	.route('/:id')
	.get(tourController.getTour)
	.patch(tourController.patchTour)
	.delete(tourController.deleteTour);
module.exports = toursRouter;
