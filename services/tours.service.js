const Tour = require('../models/tour.model');
const ApiFeatures = require('../utils/apiFeatures');

exports.getAllToursData = async (req, filter) => {
  const features = new ApiFeatures(Tour.find(filter), req.query);
  features.applyFilters();
  const tourData = await features.query;
  return tourData;
};

exports.addNewTourData = async (req) => {
  const response = await Tour.create(req.body);
  return response;
};

exports.getTourData = async (id) => {
  // eslint-disable-next-line no-useless-catch
  const tourData = await Tour.find({ _id: id }).populate('reviews');
  return tourData;
};

exports.deleteTourData = async (id) => await Tour.findByIdAndDelete(id);

exports.updateTourData = async (id, req) => {
  // eslint-disable-next-line no-useless-catch
  const tourData = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  return tourData;
};

exports.getTourStatsData = async () => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: {
          $toUpper: '$difficulty',
        },
        numTour: {
          $sum: 1,
        },
        numRatings: {
          $sum: '$ratingsQuantity',
        },
        avgRating: {
          $avg: '$ratingsAverage',
        },
        avgPrice: {
          $avg: '$price',
        },
        minPrice: {
          $min: '$price',
        },
        maxPrice: {
          $max: '$price',
        },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  return stats;
};

exports.getMonthlyPlanData = async (year) => {
  const data = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDates',
        },
        numTourStarts: {
          $sum: 1,
        },
        tours: {
          $push: '$name',
        },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
  ]);
  return data;
};
