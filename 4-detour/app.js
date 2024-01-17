const express = require('express');

const app = express();
const morgan = require('morgan');
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
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

// 3) START SERVER
module.exports = app;
