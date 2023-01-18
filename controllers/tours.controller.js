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
const tourService = require('../services/tours.service');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
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

exports.getToursWithIn = catchAsync(async (req, res, next) => {
  const { distance, unit, lngLat } = req.params;
  const [lng, lat] = lngLat.split(',');

  if (!lng || !lat)
    return next(
      new AppError(
        'Longitude and latitude are not provided in the requested format.',
        400
      )
    );

  const tours = await tourService.getToursWithinService(
    distance,
    unit,
    lng,
    lat
  );

  res.status(200).json({
    status: 'success',
    nTours: tours.length,
    tours,
  });
});

exports.getToursDistances = catchAsync(async (req, res, next) => {
  const { unit, lngLat } = req.params;
  const [lng, lat] = lngLat.split(',');

  if (!lng || !lat)
    return next(
      new AppError(
        'Longitude and latitude are not provided in the requested format.',
        400
      )
    );

  const distances = await tourService.getDistancesService(unit,lng,lat);

  res.status(200).json({
    status: 'success',
    distances,
  });
});

exports.getAllTours = handlerFactory.getAll(getAllToursData);
exports.getTour = handlerFactory.getOne(getTourData);
exports.updateTour = handlerFactory.updateOne(updateTourData);
exports.deleteTour = handlerFactory.DeleteOne(deleteTourData);
exports.addNewTour = handlerFactory.createOne(addNewTourData);
