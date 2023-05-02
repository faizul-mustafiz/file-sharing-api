const FileControllerOrigin = require('../enums/fileControllerOrigin');
const { StoreFile, FetchFile, RemoveFile } = require('../providers');

upload = async (req, res, next) => {
  try {
    await StoreFile(req, res, next);
  } catch (error) {
    error.origin = error.origin ? error.origin : FileControllerOrigin.upload;
    next(error);
  }
};
getFile = async (req, res, next) => {
  try {
    await FetchFile(req, res, next);
  } catch (error) {
    error.origin = error.origin ? error.origin : FileControllerOrigin.getFile;
    next(error);
  }
};
deleteFile = async (req, res, next) => {
  try {
    await RemoveFile(req, res, next);
  } catch (error) {
    error.origin = error.origin
      ? error.origin
      : FileControllerOrigin.deleteFile;
    next(error);
  }
};

module.exports = { upload, getFile, deleteFile };
