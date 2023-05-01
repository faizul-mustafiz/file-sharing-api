const { readFileSync } = require('fs');
const logger = require('../loggers/logger');
const { checkIfFileExists } = require('../utility/file.utility');
const readConfigJsonFile = (path) => {
  try {
    const fileExists = checkIfFileExists(path);
    console.log('fileExists', fileExists);
    if (!fileExists) {
      logger.error('config-file-does-not-exists-error', fileExists);
      process.exit(0);
    }
    const configJsonFIle = readFileSync(path);
    return JSON.parse(configJsonFIle);
  } catch (error) {
    logger.error('config-file-read-base-error', error);
    process.exit(0);
  }
};
module.exports = { readConfigJsonFile };
