/* This file is largely the same as app.js in most of our express
   applications. The only differences have been commented.
*/

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const path = require('path');

/* We need to include the express-fileupload middleware library
   (which we have installed through package.json).
*/
const fileUpload = require('express-fileupload');

const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/FileUpload';
mongoose.connect(dbURL).catch((err) => {
  if (err) {
    console.log('Could not connect to the database');
    throw err;
  }
});

const app = express();
app.use(compression());

/* We then give the express-fileupload middleware to our express
   application. This middleware works very similarly to body-parser.
   It will detect when form-data with files has been sent to our
   server. When it sees any, it will place them in the req.files
   object with each request.
*/
app.use(fileUpload());

app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.engine('handlebars', expressHandlebars.engine({
  defaultLayout: '',
}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.disable('x-powered-by');

app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
