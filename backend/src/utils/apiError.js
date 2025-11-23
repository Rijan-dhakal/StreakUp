export const apiError = (res, msg, success, statusCode = 500) => {
  return res.status(statusCode).json({ success, message: msg} );
};
