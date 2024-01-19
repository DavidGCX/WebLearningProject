const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const DATABASE = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD,
);

mongoose.connect(DATABASE).then(() => {
	console.log('DB connection successful!');
});
const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);
const importData = async () => {
	try {
		await Tour.create(tours);
		console.log('Data successfully loaded!');
	} catch (err) {
		console.log(err);
	}
	process.exit();
};
const deleteData = async () => {
	try {
		await Tour.deleteMany();
		console.log('Data successfully deleted!');
	} catch (err) {
		console.log(err);
	}
	process.exit();
};
if (process.argv[2] === '--import') {
	importData();
} else if (process.argv[2] === '--delete') {
	deleteData();
}
