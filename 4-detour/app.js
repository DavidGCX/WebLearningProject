const express = require('express');
const app = express();

app.use(express.json());
// app.get('/', (req, res) => {
// 	res
// 		.status(200)
// 		.json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
// 	res.send('You can post to this endpoint...');
// });

const fs = require('fs');

const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getTours = (req, res) => {
	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: {
			tours: tours,
		},
	});
};

const getTour = (req, res) => {
	const targetTour = tours.find((el) => el.id === req.params.id * 1);
	if (!targetTour) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID',
		});
	}
	res.status(200).json({
		status: 'success',
		data: {
			tours: targetTour,
		},
	});
};

const createTour = (req, res) => {
	const newId = tours[tours.length - 1].id + 1;
	const newTour = Object.assign({ id: newId }, req.body);
	tours.push(newTour);
	fs.writeFile(
		`${__dirname}/dev-data/data/tours-simple.json`,
		JSON.stringify(tours),
		(err) => {
			res.status(201).json({
				status: 'success',
				data: {
					tour: newTour,
				},
			});
		}
	);
};
const patchTour = (req, res) => {
	if (req.params.id * 1 > tours.length) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID',
		});
	}
	// TODO: Update tours
	res.status(200).json({
		status: 'success',
		data: {
			tour: '<Updated tour here...>',
		},
	});
};

const deleteTour = (req, res) => {
	if (req.params.id * 1 > tours.length) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID',
		});
	}
	res.status(204).json({
		status: 'success',
		data: null,
	});
};

app.route('/api/v1/tours').get(getTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(patchTour).delete(deleteTour);
const port = 3000;
app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
