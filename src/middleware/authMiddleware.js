import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return errorResponse(res, 'Not authorized to access this route', 401);
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return errorResponse(res, 'Invalid or expired token', 401);
        }
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return errorResponse(res, 'User not found', 401);
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return errorResponse(res, 'Not authorized to access this route', 401);
    }
};

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return errorResponse(res, 'You do not have permission to perform this action', 403);
        }
        next();
    };
};