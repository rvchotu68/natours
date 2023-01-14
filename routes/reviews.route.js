const express = require('express');

const reviewController = require('../controllers/reviews.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.verifyUser, reviewController.getAllReviews)
  .post(
    authController.verifyUser,
    reviewController.setTourAndUser,
    authController.restrictTo('user'),
    reviewController.addNewReview
  );

router
  .route('/:id')
  .delete(reviewController.deleteReview)
  .patch(
    authController.verifyUser,
    authController.restrictTo('user'),
    reviewController.updateReview
  );

module.exports = router;
