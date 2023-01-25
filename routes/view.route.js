const express = require('express');

const viewController = require('../controllers/views.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/me', authController.verifyUser, viewController.getAccount);

router.use(authController.isUserLoggedIn);
router.route('/').get(viewController.getTours);
router.route('/tour/:name').get(viewController.getTour);
router.route('/login').get(viewController.login);
module.exports = router;
