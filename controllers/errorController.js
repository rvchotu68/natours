const AppError = require('../utils/appError');

const sendErrorDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (res, err) => {
  //   console.log(err);
  if (err.isOperational)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  else {
    // console.log('Error:', err);
    res.status(err.statusCode).json({
      status: 'error',
      message: 'Something went wrong.',
    });
  }
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
  console.log(errors);
  const message = `Invalid input. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleTokenExpiredError = () => new AppError("User token has expired. Please login to access the resource.",401);
const handleJsonWebTokenError = () => new AppError("Invalid user token. Please login to access the resource.",401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(res, err);
  else if (process.env.NODE_ENV.trim() === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicatesErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if(err.name === 'TokenExpiredError') error = handleTokenExpiredError();
    if(err.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    sendErrorProd(res, error);
  }
};
