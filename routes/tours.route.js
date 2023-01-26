const express = require('express');
const {
  getAllTours,
  getTour,
  addNewTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tours.controller');
const authController = require('../controllers/auth.controller');
const reviewRouter = require('./reviews.route');
const tourController = require('../controllers/tours.controller');

const router = express.Router();

router.use('/:tour/reviews', reviewRouter);

//For getting the near b trips  based on the user location and search distance

router
  .route('/tour-withIn/:distance/center/:lngLat/unit/:unit')
  .get(tourController.getToursWithIn);

//For getting the distances of the trip from the user location.

router
  .route('/distances/:lngLat/unit/:unit')
  .get(tourController.getToursDistances);

// router.param('id', checkID);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.verifyUser,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan
  );
router
  .route('/')
  .get(getAllTours)
  .post(
    authController.verifyUser,
    authController.restrictTo('admin', 'lead-guide'),
    addNewTour
  );
router
  .route('/:id')
  .get(getTour)
  .patch(
    authController.verifyUser,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourPhotos,
    tourController.resizeTourPhotos,
    updateTour
  )
  .delete(
    authController.verifyUser,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

module.exports = router;
