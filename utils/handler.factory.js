const catchAsync = require('./catchAsync');
const AppError = require('./appError');

exports.DeleteOne = (method) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await method(id);
    if (!doc) return next(new AppError('No Document found.', 404));
    res.status(204).json({ status: 'success', data: null });
  });

exports.updateOne = (method) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await method(id, req);
    if (!doc) return next(new AppError('No document found', 404));
    res.status(200).json({ status: 'success', data: doc });
  });

exports.createOne = (method) =>
  catchAsync(async (req, res, next) => {
    const doc = await method(req);

    if (!doc) return next(new AppError('No document found', 404));

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

exports.getOne = (method) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id || req.user._id;
    const doc = await method(id);
    if (!doc) return next(new AppError('No document found with the id', 404));
    res.status(200).json({ status: 'success', data: doc });
  });

exports.getAll = (method) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tour) filter.tour = req.params.tour;
    const doc = await method(req, filter);
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    });
  });
