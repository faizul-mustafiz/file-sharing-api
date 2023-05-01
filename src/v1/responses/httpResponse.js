const MulterErrorCode = require('../enums/muterErrorCode.enum');

const Success = (res, { message, result }) => {
  return res.status(200).json({
    success: true,
    message,
    result,
  });
};
const Created = (res, { message, result }) => {
  return res.status(201).json({
    success: true,
    message,
    result,
  });
};

const MulterErrorResponse = (res, code) => {
  switch (code) {
    case MulterErrorCode.LimitFileSize:
      return res.status(400).json({
        success: false,
        message: 'File is too large',
        result: {},
      });
      break;
    case MulterErrorCode.LimitFileCount:
      return res.status(400).json({
        success: false,
        message: 'File upload limit reached',
        result: {},
      });
      break;
    case MulterErrorCode.LimitUnexpectedFile:
      return res.status(400).json({
        success: false,
        message: 'Unexpected file',
        result: {},
      });
      break;
    default:
      return res.status(500).json({
        success: false,
        message: 'Oops! something went wrong',
        result: {},
      });
      break;
  }
};

module.exports = {
  Success,
  Created,
  MulterErrorResponse,
};
