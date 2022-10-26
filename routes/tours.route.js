const express = require('express');
const {
  getAllTours,
  getTour,
  addNewTour,
  updateTour,
  deleteTour,
} = require('../controllers/tours.controller');

const router = express.Router();

// router.param('id', checkID);
router.route('/').get(getAllTours).post(addNewTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;