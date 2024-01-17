const express = require('express');
const toursRouter = express.Router();
const tourController = require('../controllers/tourController');
// Check ID exist
// toursRouter.param('id', tourController.checkID);
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
const a = 1;
