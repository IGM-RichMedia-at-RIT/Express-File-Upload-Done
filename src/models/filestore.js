// Pull in mongoose and create our empty file model object.
const mongoose = require('mongoose');

let FileModel = {};

// Create our schema. This is based on the data pulled in by express-fileupload.
// We can assume all of this data is required, as there will be an error from
// fileupload before we create anything in this database. You could explicitly
// define everything as required though.
const FileSchema = new mongoose.Schema({
  name: { // The name of our file as a string. We want this to be unique.
    type: String,
    unique: true,
  },
  data: { // The data of our file. This is stored as a byte array.
    type: Buffer,
  },
  size: { // The size of our file in bytes.
    type: Number,
  },
  encoding: { // The encoding type of the image in the byte array.
    type: String,
  },
  tempFilePath: { // The temp file path.
    type: String,
  },
  truncated: { // If our file has been cut off.
    type: Boolean,
  },
  mimetype: { // The type of data being stored.
    type: String,
  },
  md5: { // The md5 hash of our file.
    type: String,
  },
});

// Once we have setup the schema, we want to create our model.
FileModel = mongoose.model('FileModel', FileSchema);

// Export the model and schema.
module.exports.FileModel = FileModel;
module.exports.FileSchema = FileSchema;
