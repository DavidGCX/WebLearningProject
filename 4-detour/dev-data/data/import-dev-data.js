const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const DATABASE = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD,
)
	.replace('<USERNAME>', process.env.DATABASE_USERNAME)
	.replace('<COLLECTION>', process.env.DATABASE_COLLECTION);

mongoose.connect(DATABASE).then(() => {
	console.log('DB connection successful!');
});
const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
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

const deleteUsers = async () => {
	try {
		await User.deleteMany();
		console.log('Users successfully deleted!');
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

const importUsers = async () => {
	try {
		await User.create(users);
		console.log('Users successfully loaded!');
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

if (process.argv[2] === '--import') {
	importData();
} else if (process.argv[2] === '--delete') {
	deleteData();
} else if (process.argv[2] === '--deleteUser') {
	deleteUsers();
} else if (process.argv[2] === '--importUser') {
	importUsers();
}
