const express = require('express');

const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});
app.use(express.json());
// Serve static files
//app.use(express.static(`${__dirname}/public`));
// 2) ROUTES
const usersRouter = require('./routes/userRoutes');
const toursRouter = require('./routes/tourRoutes');

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

// When we have a request that doesn't match any of the routes above,
// we want to send back an error message.

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
