const {
  getAllToursData,
  getTourData,
  addNewTourData,
  updateTourData,
  deleteTourData,
  getTourStatsData,
  getMonthlyPlanData,
} = require('../services/tours.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('../utils/handler.factory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const tours = await getAllToursData(req, res);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tourData = await getTourData(id);
  if (!tourData.length) return next(new AppError('No tour found', 404));
  res.status(200).json({ status: 'success', data: { tourData } });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const data = await getTourStatsData();
  // console.log(data);
  res.status(200).json({
    status: 'success',
    message: data,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const data = await getMonthlyPlanData(req.params.year * 1);
  // console.log(data);
  res.status(200).json({
    status: 'success',
    message: data,
  });
});

exports.updateTour = handlerFactory.updateOne(updateTourData);
exports.deleteTour = handlerFactory.DeleteOne(deleteTourData);
exports.addNewTour = handlerFactory.createOne(addNewTourData);
