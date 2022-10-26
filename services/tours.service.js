const Tour = require('../models/tour.model');

exports.getAllToursData = async (req, res) => {
  // eslint-disable-next-line no-useless-catch
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((ele) => delete queryObj[ele]);

  // This is for advance filtering
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  /**
   * The above code snippet checks for get ,gt,lte and lt and replaces them with $gte , $lt, $lte and $gt
   */
  let query = Tour.find(JSON.parse(queryString));

  // SORT
  if (req.query.sort) {
    query = query.sort(req.query.sort);
  } else query = query.sort('-createdAt');

  const tourData = await Tour.find(query);
  return tourData;
};

exports.addNewTourData = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await Tour.create(data);
    return response;
  } catch (err) {
    throw err;
  }
};

exports.getTourData = async (id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const tourData = await Tour.find({ _id: id });
    return tourData;
  } catch (err) {
    throw err;
  }
};

exports.deleteTourData = async (id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    return await Tour.findByIdAndDelete(id);
  } catch (err) {
    throw err;
  }
};

exports.updateTourData = async (id, data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const tourData = await Tour.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return tourData;
  } catch (err) {
    throw err;
  }
};
