process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

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
  });

const { PORT } = process.env;
const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    console.log('Shutting down the server.');
    process.exit(1);
  });
});
