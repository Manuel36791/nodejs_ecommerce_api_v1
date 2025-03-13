
// @desc      This class is used to create custom error messages for predicted errors
class ApiError extends Error {
  
    constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    this.isOperational = true;
  }
}

module.exports = ApiError;
