import { errorResponse } from '../utils/response.js';

export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    let message = err.message || 'Internal Server Error';
    let errors = null;

    if (err.name === 'CastError') {
        message = `Resource not found with id of ${err.value}`;
        statusCode = 404;
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate field value: ${field} already exists`;
        statusCode = 400;
    }

    if (err.name === 'ValidationError') {
        errors = {};
        Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors[key].message;
        });
        message = 'Validation failed';
        statusCode = 400;
    }

    if (err.name === 'JsonWebTokenError') {
        message = 'Invalid token';
        statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        message = 'Token expired';
        statusCode = 401;
    }

    console.error('Error:', err);

    errorResponse(res, message, statusCode, errors);
};