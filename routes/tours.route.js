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

const router = express.Router();

router.use('/:tour/reviews', reviewRouter);

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
    updateTour
  )
  .delete(
    authController.verifyUser,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

module.exports = router;
