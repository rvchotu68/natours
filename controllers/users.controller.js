const multer = require('multer');
const sharp = require('sharp');

const catchAsync = require('../utils/catchAsync');
const UserService = require('../services/users.service');
const handlerFactory = require('../utils/handler.factory');
const AppError = require('../utils/appError');
const {
  updateUserDetails,
  getUserService,
  getAllUsersDetails,
} = require('../services/users.service');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const filename = `user-${req.user._id}-${Date.now()}.${
//       file.mimetype.split('/')[1]
//     }`;
//     cb(null, filename);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Only upload photos.', 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// const upload = multer({ dest: 'public/img/users' });

exports.uploadUserPhoto = upload.single('photo');

//Incase of single image the req object will have file object.
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  //check if the image is uploaded. If not just return next() to go to the next middleware.
  if (!req.file) return next();

  //resize the image and save the file on the disk
  //Since we are storing the image in memory, a new filed will be created in the file called buffer and the image will be stored in it.
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

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
