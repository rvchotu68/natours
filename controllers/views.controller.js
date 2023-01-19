const Tour = require('../models/tour.model');
const catchAsync = require('../utils/catchAsync');

exports.getTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = (req, res, next) => {
  res.status(200).render('tour', {
    title: 'Tour',
  });
};
