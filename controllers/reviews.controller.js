const {
  addNewReviewService,
  getAllReviewsService,
  deleteReviewService,
  updateReviewService,
  getReviewService,
} = require('../services/reviews.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('../utils/handler.factory');

exports.setTour = (req, res, next) => {
  req.params.tour
    ? (req.body.filter = req.params.tour)
    : (req.body.filter = {});

  next();
};

exports.getAllReviews = handlerFactory.getAll(getAllReviewsService);

exports.setTourAndUser = (req, res, next) => {
  !req.body.tour && (req.body.tour = req.params.tour);
  !req.body.user && (req.body.user = req.user._id);

  next();
};

exports.addNewReview = handlerFactory.createOne(addNewReviewService);
exports.deleteReview = handlerFactory.DeleteOne(deleteReviewService);
exports.updateReview = handlerFactory.updateOne(updateReviewService);
exports.getReview = handlerFactory.getOne(getReviewService);
