const { randomBytes } = require('crypto');

const generateKeyPair = () => {
  const publicKey = randomBytes(16).toString('hex');
  const privateKey = randomBytes(32).toString('hex');
  return { publicKey, privateKey };
};

const generateFilePayloadForRedis = (payload) => {
  if (payload && payload.file && payload.keys)
    return {
      originalname: payload.file.originalname,
      mimetype: payload.file.mimetype,
      encoding: payload.file.encoding,
      destination: payload.file.destination,
      filename: payload.file.filename,
      path: payload.file.path,
      size: payload.file.size,
      publicKey: payload.keys.publicKey,
      privateKey: payload.keys.privateKey,
    };
};

const generateFileUploadSuccessResponseResult = (payload) => {
  if (payload && payload.file && payload.keys)
    return {
      fileName: payload.file.originalname,
      path: payload.file.path,
      publicKey: payload.keys.publicKey,
      privateKey: payload.keys.privateKey,
    };
};
const generateFileDeleteSuccessResponseResult = (payload) => {
  return {
    fileName: payload.originalname,
    path: payload.path,
  };
};

module.exports = {
  generateKeyPair,
  generateFilePayloadForRedis,
  generateFileUploadSuccessResponseResult,
  generateFileDeleteSuccessResponseResult,
};
