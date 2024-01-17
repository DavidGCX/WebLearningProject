const Tour = require('./../models/tourModel');

exports.getTours = (req, res) => {
	res.status(200).json({
		status: 'success',
	});
};

exports.getTour = (req, res) => {
	res.status(200).json({
		status: 'success',
	});
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
			message: 'Invalid data sent!',
		});
	}
};
exports.patchTour = (req, res) => {
	res.status(200).json({
		status: 'success',
		data: {
			tour: '<Updated tour here...>',
		},
	});
};

exports.deleteTour = (req, res) => {
	res.status(204).json({
		status: 'success',
		data: null,
	});
};
