//1)Declarations
const express = require('express'); //This returns a function which upon calling returns an object which will have bunch of methods used for creating web application.
const morgan = require('morgan');
const tourRouter = require('./routes/tours.route');
const userRouter = require('./routes/users.route');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//2.Middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} route not found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
