// Import our file database. If you are continuing from the DomoMaker codebase,
// you should instead use an import of ../models to import the /models/index.js file.
// Ensure that your file model is properly being exported in the /models/index.js file
// for that to work properly.
const filedb = require('../models/filestore.js');

// A simple controller to render the upload.handlebars page.
const uploadPage = (req, res) => {
  res.render('upload');
};

// Our upload handler.
const uploadFile = (req, res) => {
  // When things are uploaded with the 'multipart/formdata' encoding type, the
  // express-fileupload library will create an object and store it in req.files.
  // We want to ensure that object exists. Once we know it exists, we also want
  // to make sure that there is a file within it. Since fileupload can accept
  // multiple files at once, we want to ensure that we have at least one. We can
  // easily do this by looking at the keys in our req.files object and ensuring it
  // is a non-zero value.
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  // Once we are sure we have a file, we want to pull our sample file out of our
  // req.files object. It is called sampleFile because that is what we named it on
  // line 19 of our /views/upload.handlebars file. Here, we are destructuring our
  // req.files object to pull out sampleFile and store it in it's own variable.
  // The line below is equivalent to:   const sampleFile = req.files.sampleFile.
  const { sampleFile } = req.files;

  // Once we have the file, we want to create a mongo document based on that file
  // that can be stored in our database.
  const fileDoc = new filedb.FileModel(sampleFile);

  // Once we have that mongo document, we can save it into the database.
  const savePromise = fileDoc.save();

  // The promises 'then' event is called if the document is successfully stored in
  // the database. If that is the case, we will send a success message to the user.
  savePromise.then(() => {
    res.status(201).json({ message: 'Upload Successful! ' });
  });

  // The promises 'catch' event is called if there is an error when adding the document
  // to the database. If that is the case, we want to log the error and send a 400 status
  // back to the user.
  savePromise.catch((error) => {
    console.dir(error);
    res.status(400).json({ error: 'Something went wrong uploading' });
  });

  // Finally we will return the savePromise to prevent eslint errors.
  return savePromise;
};

// Our retrieval handler.
const retrieveFile = (req, res) => {
  // When making a GET request to /retrieve, the user should be providing a query parameter
  // of fileName to provide the name of the file in question. If it doesn't exist, send back
  // an error.
  if (!req.query.fileName) {
    return res.status(400).json({ error: 'Missing File Name! ' });
  }

  // If we do have the file name, we want to find that file in the database. We can do this
  // by using the findOne function that exists in all mongoose models. We will pass in the
  // fileName as 'name' in our search object. The callback function will accept an error and
  // a document. The error will be populated if something goes wrong. The doc will be populated
  // if a file with that name is found. We will return to prevent eslint errors.
  return filedb.FileModel.findOne({ name: req.query.fileName }, (error, doc) => {
    // If there is an error, log it and send a 400 back to the client.
    if (error) {
      console.dir(error);
      return res.status(400).json({ error: 'An error occured retrieving the file. ' });
    }

    // If no file with that name is found, but the search is successful, an error will not be
    // thrown. Instead, we will simply not recieve and error or a doc back. In that case, we
    // want to tell the user that the file they were looking for could not be found.
    if (!doc) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Finally, if the search was successful, we want to send back our document. Here, we will
    // use the built in response writeHead and end functions to send the data back to the user.
    res.writeHead(200, { 'Content-Type': doc.mimetype, 'Content-Length': doc.size });
    return res.end(doc.data);
  });
};

// Finally, export everything.
module.exports.uploadPage = uploadPage;
module.exports.uploadFile = uploadFile;
module.exports.retrieveFile = retrieveFile;
