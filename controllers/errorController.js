const AppError = require('../utils/appError');

const sendErrorDev = (res, req, err) => {
  if (req.originalUrl.startsWith('/api'))
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (res, req, err) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational)
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    else {
      return res.status(err.statusCode).json({
        status: 'error',
        message: 'Something went wrong.',
      });
    }
  }

  if (err.isOperational)
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again',
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicatesErrorDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((ele) => ele.message);
  const message = `Invalid input. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleTokenExpiredError = () =>
  new AppError(
    'User token has expired. Please login to access the resource.',
    401
  );
const handleJsonWebTokenError = () =>
  new AppError('Invalid user token. Please login to access the resource.', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(res, req, err);
  else if (process.env.NODE_ENV.trim() === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicatesErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError();
    if (err.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    sendErrorProd(res, req, error);
  }
};
