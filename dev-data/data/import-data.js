const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');

const Tour = require('../../models/tour.model');

dotenv.config({ path: `./../../config.env` });
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// console.log(process.env);

const DB_URI = process.env.DATABASE_CLOUD.replace(
  '<password>',
  process.env.PASSWORD
);
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to the dbs');
  });

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data imported');
  } catch (err) {
    console.log('data import failed with error:', err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany({});
    console.log('data deleted');
  } catch (err) {
    console.log('data deletion failed with error:', err);
  }
  process.exit();
};

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();
