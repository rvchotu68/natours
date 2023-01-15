const express = require('express');

const reviewController = require('../controllers/reviews.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router({ mergeParams: true });

router.use(authController.verifyUser);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    reviewController.setTourAndUser,
    authController.restrictTo('user'),
    reviewController.addNewReview
  );

router
  .route('/:id')
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  );

module.exports = router;
