const Tour = require('../models/tour.model');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

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

exports.getToursWithinService = async (distance, unit, lng, lat) => {
  //The circle radius is measured in radian. radian = distance/radius of Earth in miles or distance/radius of earth in kms(3963.2 in miles and 6378.1 in kms)
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  const data = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });

  return data;
};

exports.getDistancesService = async (unit, lng, lat) => {
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        key: 'startLocation',
      },
    },
    {
      $project: {
        name: 1,
        distance: 1,
      },
    },
  ]);

  return distances;
};
