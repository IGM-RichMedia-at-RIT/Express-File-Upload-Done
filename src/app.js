// Import libraries.
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const fileUpload = require('express-fileupload');

// Setup our router.
const router = require('./router.js');

// Configure our port and our mongodb instance.
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/ImageUpload';
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};
mongoose.connect(dbURL, mongooseOptions, (err) => {
  if (err) {
    console.log('Could not connect to the database');
    throw err;
  }
});

// Setup our express app with compression.
const app = express();
app.use(compression());

// Add our fileUpload plugin. This will take any data uploaded with the 'multipart/formdata'
// encoding type, and add them to the req.files object in our requests.
app.use(fileUpload());

// Continue adding standard plugins that already exist in DomoMaker, etc.
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.engine('handlebars', expressHandlebars({
  defaultLayout: '',
}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.disable('x-powered-by');
app.use(cookieParser());

// Pull in our routes.
router(app);

// Start the server.
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
