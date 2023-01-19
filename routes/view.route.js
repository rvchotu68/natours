const express = require('express');

const viewController = require('../controllers/views.controller');

const router = express.Router();

router.route('/').get(viewController.getTours);
router.route('/tour').get(viewController.getTour);

module.exports = router;
