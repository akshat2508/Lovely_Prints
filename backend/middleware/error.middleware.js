// middleware/error.middleware.js
import logger from "../utils/logger.js";
const errorMiddleware = (err, req, res, next) => {
logger.error({
  message: err.message,
  stack: err.stack,
  route: req.originalUrl,
  method: req.method
});
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorMiddleware;