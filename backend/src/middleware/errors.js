function notFound(req, res) {
  res.status(404).json({
    error: "Not Found",
    message: `No route found for ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status ?? 500;
  const message = status === 500 ? "Internal server error" : error.message;

  res.status(status).json({
    error: error.name ?? "Error",
    message,
  });
}

module.exports = {
  errorHandler,
  notFound,
};
