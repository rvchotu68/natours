const multer = require('multer');
const sharp = require('sharp');

const {
  getAllToursData,
  getTourData,
  addNewTourData,
  updateTourData,
  deleteTourData,
  getTourStatsData,
  getMonthlyPlanData,
} = require('../services/tours.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('../utils/handler.factory');
const tourService = require('../services/tours.service');

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

//upload.single is used when there is only one image uploaded.
//we can use upload.array('field_name',number of photos) this is used when multiple photos are uploaded for single field.
//upload.fields([{name:'field_name',maxCount: no of pics},{}...]) this is used when multiple photos are uploaded for multiple fields

exports.uploadTourPhotos = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 3,
  },
]);

//Incase of upload.array and upload.fields files object will be added to req instead of file object.
exports.resizeTourPhotos = catchAsync(async (req, res, next) => {
  // here each field will have an array. In this imageCover will be an array and images will be an array.
  if (!req.files.imageCover || !req.files.images) return next();

  //Resize the imageCover and add it to the req.body
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  //Resize images  and add them to req.body.images
  req.body.images = [];
  //promise.all is used because call back inside map will return promise and to get the value we have await it otherwise next() will be called even before resizing of all images are done.
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const fileName = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333, {
          position: 'right',
        })
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${fileName}`);
      req.body.images.push(fileName);
    })
  );

  next();
});

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
exports.getTourStats = catchAsync(async (req, res, next) => {
  const data = await getTourStatsData();
  res.status(200).json({
    status: 'success',
    message: data,
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const data = await getMonthlyPlanData(req.params.year * 1);
  res.status(200).json({
    status: 'success',
    message: data,
  });
});

exports.getToursWithIn = catchAsync(async (req, res, next) => {
  const { distance, unit, lngLat } = req.params;
  const [lng, lat] = lngLat.split(',');

  if (!lng || !lat)
    return next(
      new AppError(
        'Longitude and latitude are not provided in the requested format.',
        400
      )
    );

  const tours = await tourService.getToursWithinService(
    distance,
    unit,
    lng,
    lat
  );

  res.status(200).json({
    status: 'success',
    nTours: tours.length,
    tours,
  });
});

exports.getToursDistances = catchAsync(async (req, res, next) => {
  const { unit, lngLat } = req.params;
  const [lng, lat] = lngLat.split(',');

  if (!lng || !lat)
    return next(
      new AppError(
        'Longitude and latitude are not provided in the requested format.',
        400
      )
    );

  const distances = await tourService.getDistancesService(unit, lng, lat);

  res.status(200).json({
    status: 'success',
    distances,
  });
});

exports.getAllTours = handlerFactory.getAll(getAllToursData);
exports.getTour = handlerFactory.getOne(getTourData);
exports.updateTour = handlerFactory.updateOne(updateTourData);
exports.deleteTour = handlerFactory.DeleteOne(deleteTourData);
exports.addNewTour = handlerFactory.createOne(addNewTourData);
