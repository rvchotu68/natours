const express = require('express');

const viewController = require('../controllers/views.controller');
const authController = require('../controllers/auth.controller');
const bookingController = require('../controllers/booking.controller');

const router = express.Router();

router.use(viewController.checkAlert);

router.get('/me', authController.verifyUser, viewController.getAccount);
router.get(
  '/my-bookings',
  authController.verifyUser,
  bookingController.getMyBookings
);
router.use(authController.isUserLoggedIn);
router
  .route('/')
  .get(bookingController.createBookingCheckout, viewController.getTours);
router.route('/tour/:name').get(viewController.getTour);
router.route('/login').get(viewController.login);
module.exports = router;
