const ErrorHandler = (err, req, res, next) => {
  const errorStatus = err.statusCode || 500;
  const errorMessage = err.message || 'Oops! something went wrong';
  return res.status(errorStatus).json({
    success: false,
    message: errorStatus >= 500 ? 'Oops! something went wrong' : errorMessage,
    result: {},
  });
};

module.exports = ErrorHandler;
