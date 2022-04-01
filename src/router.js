const file = require('./controllers/files.js');

// Here we simply hook up our POST and GET routes.
const router = (app) => {
  app.post('/upload', file.uploadFile);

  app.get('/retrieve', file.retrieveFile);

  app.get('/', file.uploadPage);
};

module.exports = router;
