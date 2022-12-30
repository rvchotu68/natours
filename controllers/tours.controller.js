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

// console.log(__dirname);
exports.addNewTour = catchAsync(async (req, res, next) => {
  const response = await addNewTourData(req.body);
  res.status(201).json({ status: 'success', data: response });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tourData = await getTourData(id);
  if (!tourData.length) return next(new AppError('No tour found', 404));
  res.status(200).json({ status: 'success', data: { tourData } });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await updateTourData(id, req.body);
  if (!tour.length) return next(new AppError('No tour found', 404));
  res.status(200).json({ status: 'success', data: { tour } });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await deleteTourData(id, req.body);
  res.status(204).json({ status: 'success', data: null });
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

// exports.checkID = (req, res, next, val) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   const { name, price } = req.body;

//   if (!name || !price)
//     return res.status(400).json({ status: 'fail', message: 'Invalid body' });
//   next();
// };
