// Pull in our file controllers. If you are continuing from DomoMaker, you likely
// have the import for the entire controllers folder. In that case, you want to make
// sure your controllers/index.js is properly importing and exporting the files.js file.
const file = require('./controllers/files.js');

const router = (app) => {
  // Setup post requests to /upload.
  app.post('/upload', file.uploadFile);

  // Setup get requests to /retrieve
  app.get('/retrieve', file.retrieveFile);

  // Setup get requests to the root for the index page.
  app.get('/', file.uploadPage);
};

module.exports = router;
