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
