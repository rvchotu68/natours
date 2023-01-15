const catchAsync = require('../utils/catchAsync');
const UserService = require('../services/users.service');
const handlerFactory = require('../utils/handler.factory');
const {
  updateUserDetails,
  getUserService,
  getAllUsersDetails,
} = require('../services/users.service');

exports.getAllUsers = handlerFactory.getAll(getAllUsersDetails);
exports.addNewUser = catchAsync((req, res, next) => {});
exports.getUser = handlerFactory.getOne(getUserService);
exports.getMe = handlerFactory.getOne(getUserService);
exports.updateUser = handlerFactory.updateOne(updateUserDetails);

exports.updateMe = catchAsync(async (req, res, next) => {
  //1)Create error if user posts password data

  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError('Please provide either name or email data to update. '),
      400
    );

  //2)Filter out unwanted fields names that are not allowed to be updated and update the user fields.

  const updatedData = await UserService.updateUserDetails(req.user._id, req);

  //3)Send the updated  user details to the client.
  res.status(200).json({
    status: 'success',
    user: updatedData,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await UserService.deleteUserAcc(req.user);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
