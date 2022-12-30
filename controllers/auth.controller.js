const User = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const data = await User.signupService(req);
  res.status(200).json({
    status: 'success',
    user: data,
  });
});
