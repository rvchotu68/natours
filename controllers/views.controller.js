const Tour = require('../models/tour.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { name } = req.params;

  const tour = await Tour.findOne({ name }).populate({
    path: 'reviews',
    field: 'review rating user',
  });

  if (!tour) return next(new AppError('Tour not found.', 404));

  res.status(200).render('tour', {
    title: name,
    tour,
  });
});

exports.login = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in into your  account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};

exports.checkAlert = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediately, please come back later.";
  next();
};
