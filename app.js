//1)Declarations
const express = require('express'); //This returns a function which upon calling returns an object which will have bunch of methods used for creating web application.
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const pug = require('pug');

const tourRouter = require('./routes/tours.route');
const userRouter = require('./routes/users.route');
const reviewRouter = require('./routes/reviews.route');
const viewRouter = require('./routes/view.route');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//2.GLOBAL MIDDLEWARE

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
//set security related http headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//this is for limiting the number of requests from an ip
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests.',
});
app.use('/api', limiter);

//this is for putting the user data in the req.body
app.use(express.json({ limit: '10kb' }));

//data sanitization against nosql query injection
app.use(mongoSanitize());

//data sanitization against xss
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'maxGroupSize',
      'price',
    ],
  })
);

//different routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
//this is for handling undefined or wrong routes
app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} route not found`, 404));
});

//global error handler middleware.
app.use(globalErrorHandler);

module.exports = app;
