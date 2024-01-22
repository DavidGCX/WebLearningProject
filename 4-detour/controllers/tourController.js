const fs = require('fs');
const Tour = require('./../models/tourModel');
const { url } = require('inspector');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   console.log(req.body);
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

exports.getAllTours = async (req, res) => {
	// Create a new object from req.query

	try {
		const queryObj = { ...req.query };
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach((el) => delete queryObj[el]);
		const query = Tour.find(queryObj);
		const tours = await query;
		res.status(200).json({
			status: 'success',
			results: tours.length,
			data: {
				tours,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err,
		});
	}
};

exports.getTour = async (req, res) => {
	try {
		// Tour.findOne({ _id: req.params.id })
		const tour = await Tour.findById(req.params.id);
		res.status(200).json({
			status: 'success',
			data: {
				tour,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err,
		});
	}
};

exports.createTour = async (req, res) => {
	try {
		const newTour = await Tour.create(req.body);
		res.status(201).json({
			status: 'success',
			data: {
				tour: newTour,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err,
		});
	}
};
exports.patchTour = async (req, res) => {
	try {
		const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(201).json({
			status: 'success',
			data: {
				tour: newTour,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: 'Invalid data sent!',
		});
	}
};

exports.deleteTour = async (req, res) => {
	try {
		await Tour.findByIdAndDelete(req.params.id);
		res.status(204).json({
			status: 'success',
			data: null,
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err,
		});
	}
};
