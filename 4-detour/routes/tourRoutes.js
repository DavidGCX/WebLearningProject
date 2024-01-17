const express = require('express');
const toursRouter = express.Router();
const tourController = require('../controllers/tourController');
toursRouter.param('id', tourController.checkID);

toursRouter
	.route('/')
	.get(tourController.getTours)
	.post(tourController.checkBody, tourController.createTour);
toursRouter
	.route('/:id')
	.get(tourController.getTour)
	.patch(tourController.patchTour)
	.delete(tourController.deleteTour);
module.exports = toursRouter;
