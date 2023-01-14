const {
  addNewReviewService,
  getAllReviewsService,
  deleteReviewService,
  updateReviewService,
} = require('../services/reviews.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('../utils/handler.factory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tour) filter.tour = req.params.tour;
  const reviews = await getAllReviewsService(filter);
  console.log({ reviews });
  res.status(200).json({
    status: 'success',
    reviewLength: reviews.length,
    reviews,
  });
});

exports.setTourAndUser = (req, res, next) => {
  !req.body.tour && (req.body.tour = req.params.tour);
  !req.body.user && (req.body.user = req.user._id);

  next();
};

exports.addNewReview = handlerFactory.createOne(addNewReviewService);
exports.deleteReview = handlerFactory.DeleteOne(deleteReviewService);
exports.updateReview = handlerFactory.updateOne(updateReviewService);
