const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

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

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
