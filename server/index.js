require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connect } = require('mongoose');
const router = require('./routes/router');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);

app.listen(
  PORT,
  () => {
    console.log(`Server started on port ${PORT}.`);

    connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }, () => {
      console.log('Connection to database is successful.');
    });
  },
);
