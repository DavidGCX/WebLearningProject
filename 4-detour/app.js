const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs');
// 1) MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
// Serve static files
//app.use(express.static(`${__dirname}/public`));
// 2) ROUTES
const usersRouter = require('./routes/userRoutes');
const toursRouter = require('./routes/tourRoutes');
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

// 3) START SERVER
module.exports = app;
