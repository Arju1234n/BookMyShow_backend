// Global error handler for Express routes
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
        error: err.message,
        // Only show full stack trace in development, hide it in production
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

// Middleware for handling non-existent 404 routes
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = {
    errorHandler,
    notFound
};
