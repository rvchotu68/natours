const {
  getAllToursData,
  getTourData,
  addNewTourData,
  updateTourData,
  deleteTourData,
} = require('../services/tours.service');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await getAllToursData(req, res);
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.send(500).json({ status: 'fail', message: err });
  }
};
// console.log(__dirname);
exports.addNewTour = async (req, res) => {
  try {
    const response = await addNewTourData(req.body);
    res.status(201).json({ status: 'success', data: response });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tourData = await getTourData(id);
    res.status(200).json({ status: 'success', data: { tourData } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.updateTour = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await updateTourData(id, req.body);
    res.status(200).json({ status: 'success', data: { response } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteTourData(id, req.body);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

// exports.checkID = (req, res, next, val) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   const { name, price } = req.body;

//   if (!name || !price)
//     return res.status(400).json({ status: 'fail', message: 'Invalid body' });
//   next();
// };
