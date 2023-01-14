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
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(authController.verifyUser, getAllTours).post(addNewTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(
    authController.verifyUser,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

module.exports = router;
