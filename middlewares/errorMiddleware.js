const globalError = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
 if (process.env.NODE_ENV === "development") {
     sendDevError(error, res);
 } else {
     sendProdError(error, res);
 }
};

const sendDevError = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    statusCode: error.statusCode,
    error,
    message: error.message,
    stack: error.stack,
  });
}

const sendProdError = (error, res) => {
    res.status(error.statusCode).json({
      status: error.status,
      statusCode: error.statusCode,
      message: error.message,
    });
}

module.exports = globalError;
