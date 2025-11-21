export const apiError = function(msg, success ,statusCode = 500) {
    const error = new Error(msg);
    error.success = success;
    error.statusCode = statusCode;
    throw error;
}