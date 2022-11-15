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
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the dbs');
  })
  .catch((err) => console.log(err));

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
