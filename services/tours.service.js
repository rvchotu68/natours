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
    const sortStr = req.query.sort.split(',').join(' ');
    query = query.sort(sortStr);
  } else query = query.sort('-createdAt');

  //Limiting
  if (req.query.fields) {
    const fieldsStr = req.query.fields.split(',').join(' ');
    query = query.select(fieldsStr);
  } else query = query.select('-__v');

  //Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const toursCount = Tour.countDocuments();
    if (skip >= toursCount)
      throw new Error("Didn't find  the page looking for. ");
  }

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
