export const errorHandler = (err, req, res, next) => {
  console.error(err); // 🔥 logs full error

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",

    // Optional: show stack only in development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};