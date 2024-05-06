export const errorHandler = (statusCode, message, code) => {
  const error = new Error();

  error.statusCode = statusCode;
  error.message = message;
  error.code = code || "SOMETHING_WENT_WRONG";
  return error;
};
