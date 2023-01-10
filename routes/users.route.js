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
router.post('/login',authController.login);
router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);
router.patch('/updatePassword',authController.verifyUser,authController.updatePassword);


router.route('/').get(getAllUsers).post(addNewUser);
router.route('/:id').get(getUser).patch(UpdateUser).delete(deleteUser);

module.exports = router;
