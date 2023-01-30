const AuthService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendMail = require('../utils/email');
const User = require('../models/users.model');
const { deleteUserService } = require('../services/auth.service');
const handlerFactory = require('../utils/handler.factory');
const Email = require('../utils/email');

exports.signup = catchAsync(async (req, res, next) => {
  const data = await AuthService.signupService(req);
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(data, url).sendWelcome();
  AuthService.sendCreatedToken(data, 200, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  //check if email and password are provided by the user or not.
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  // check if the email exists and password is correct, If the user is verified then return a jwtToken
  const userData = await AuthService.loginService(email, password);

  if (!userData) return next(new AppError('Invalid email or password', 401));

  // res.status(200).json({
  //   status: 'success',
  //   jwtToken,
  // });
  AuthService.sendCreatedToken(userData, 200, req, res);
});

exports.verifyUser = catchAsync(async (req, res, next) => {
  //check if the jwtToken is present in the request or not
  let jwtToken = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    jwtToken = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) jwtToken = req.cookies.jwt;

  if (!jwtToken)
    return next(new AppError('The user is not authenticated.', '401'));

  //Verify JWTToken
  const decodedJWTToken = await AuthService.verifyJWTToken(jwtToken);

  //Check if user still exists
  const user = await AuthService.getUserById(decodedJWTToken.id);
  if (!user)
    return next(
      new AppError(
        'The user account of this token no longer exists in the system.',
        401
      )
    );

  //Check if the user changed the password.
  if (user.isPasswordChanged(decodedJWTToken.iat))
    return next(
      new AppError(
        'Password has been modified. Please login back to access the resource'
      )
    );
  req.user = user;
  res.locals.user = user;

  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(
          "User doesn't have the authorization to perform the activity.",
          403
        )
      );

    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get the user details using the email and throw error if the user is not found in the db.
  const { email } = req.body;
  const user = await AuthService.getUserByEmail(email);
  if (!user)
    return next(
      new AppError('There is no user with the given email address.', 404)
    );

  //generate random reset token
  const passwordResetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send an email to the user with the reset token and link.

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetpassword/${passwordResetToken}`;

    await new Email(user, resetURL).sendPasswordResetLink();

    res.status(200).json({
      status: 'success',
      message: 'Reset link has been sent to the registered email.',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(
      new AppError(
        'Failed to send the reset link to the given mail address. Please try again later.',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const resetToken = req.params.token;

  //Get the user based on reset token sent to the user and check if the token has expired or not.

  const hashedResetToken = await AuthService.createPasswordRestTokenHash(
    resetToken
  );

  const user = await AuthService.getUserByResetToken(hashedResetToken);

  if (!user) return next(new AppError('Invalid token or expired.', 400));

  //  if there is a user then assign the new password and reset passwordResetToken and passwordRestTokenExpire

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //update passwordChangedAt property for user.

  //Log the user in and send jwt token.
  AuthService.sendCreatedToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //extract the password from the req body
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword)
    return next(
      new AppError(
        'Please provide current password,new password and confirm new password.',
        400
      )
    );
  //check if the password is matching with the one stored in the db
  const user = await User.findOne({ _id: req.user._id }).select('+password');
  const isPasswordValid = await user.verifyPassword(
    currentPassword,
    user.password
  );
  if (!isPasswordValid)
    return next(
      new AppError('Invalid credentials. Please try again later.', 401)
    );
  //If the password is correct then update the password
  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  await user.save();
  // Login the user and send new jwt token.
  AuthService.sendCreatedToken(user, 200, req, res);
});

exports.deleteUser = handlerFactory.DeleteOne(deleteUserService);

exports.isUserLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    //Verify JWTToken
    const decodedJWTToken = await AuthService.verifyJWTToken(req.cookies.jwt);

    //Check if user still exists
    const user = await AuthService.getUserById(decodedJWTToken.id);
    if (!user) return next();

    //Check if the user changed the password.
    if (user.isPasswordChanged(decodedJWTToken.iat)) return next();
    res.locals.user = user;
  }

  next();
};

exports.logOutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000),
  });
  res.status(200).json({
    status: 'success',
  });
};
