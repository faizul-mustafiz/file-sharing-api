const express = require('express');
const fileRouter = express.Router();

const { FileController } = require('../controllers/index');
const validatePublicKey = require('../middlewares/validatePublicKey.middleware');
const validatePrivateKey = require('../middlewares/validatePrivateKey.middleware');

fileRouter.post('/', FileController.upload);
fileRouter.get('/:publicKey', [validatePublicKey], FileController.getFile);
fileRouter.delete(
  '/:privateKey',
  [validatePrivateKey],
  FileController.deleteFile,
);

module.exports = fileRouter;
