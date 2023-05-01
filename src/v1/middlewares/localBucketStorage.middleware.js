const util = require('util');
const multer = require('multer');
const { join } = require('path');
const {
  folder,
  provider,
  formDataKey,
  maxFileSize,
} = require('../configs/fileStorage.config');

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, req.keys.publicKey);
  },
});

let upload = multer({
  storage: storage,
  limits: { fileSize: Number(maxFileSize) },
}).single(formDataKey);

let uploadFile = util.promisify(upload);
module.exports = uploadFile;
