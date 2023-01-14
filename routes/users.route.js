const express = require('express');
const {
  getAllUsers,
  getUser,
  addNewUser,
  updateUser,
} = require('../controllers/users.controller');
const authController = require('../controllers/auth.controller');
const usersController = require('../controllers/users.controller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  authController.verifyUser,
  authController.updatePassword
);
router.patch(
  '/updateMe',
  authController.verifyUser,
  authController.restrictTo('user'),
  usersController.updateMe
);
router.delete('/deleteMe', authController.verifyUser, usersController.deleteMe);

router.route('/').get(getAllUsers).post(addNewUser);
router
  .route('/:id')
  .get(getUser)
  .patch(
    authController.verifyUser,
    authController.restrictTo('admin'),
    updateUser
  )
  .delete(authController.deleteUser);

module.exports = router;
