const express = require('express');

const authController = require('../controllers/auth.controller');
const usersController = require('../controllers/users.controller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//For remaining routes we need user to be authenticated
router.use(authController.verifyUser);

router.patch('/updatePassword', authController.updatePassword);
router.patch(
  '/updateMe',
  authController.restrictTo('user'),
  usersController.updateMe
);
router.get('/me', usersController.getMe);
router.delete(
  '/deleteMe',
  authController.restrictTo('user'),
  usersController.deleteMe
);

//remaining routes needs admin role to perform the action.

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.addNewUser);
router
  .route('/:id')
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(authController.deleteUser);

module.exports = router;
