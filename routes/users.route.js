const express = require('express');
const {
  getAllUsers,
  getUser,
  addNewUser,
  UpdateUser,
  deleteUser,
} = require('../controllers/users.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', authController.signup);

router.route('/').get(getAllUsers).post(addNewUser);
router.route('/:id').get(getUser).patch(UpdateUser).delete(deleteUser);

module.exports = router;
