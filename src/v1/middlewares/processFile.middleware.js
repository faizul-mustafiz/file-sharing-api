const util = require('util');
const multer = require('multer');
const {
  provider,
  config,
  formDataKey,
  maxFileSize,
} = require('../configs/file.config');
const { readConfigJsonFile } = require('../plugins/configFile.plugin');
const Provider = require('../enums/provider.enum');
const fileStorageConfig = readConfigJsonFile(config);
const { bucketName } = fileStorageConfig;

const distStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, bucketName);
  },
  filename: (req, file, cb) => {
    cb(null, req.keys.publicKey);
  },
});

const memoryStorage = multer.memoryStorage();

const storage =
  provider && provider == Provider.local ? distStorage : memoryStorage;

const processFile = multer({
  storage: storage,
  limits: { fileSize: Number(maxFileSize) },
}).single(formDataKey);

const processFileMiddleware = util.promisify(processFile);
module.exports = processFileMiddleware;
