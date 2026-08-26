import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, 'Please provide email and password', 400);
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return errorResponse(res, 'Invalid email or password', 401);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return errorResponse(res, 'Invalid email or password', 401);
        }

        const token = generateToken(user._id);
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        successResponse(res, { user: userData, token }, 'Login successful');
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        successResponse(res, { user }, 'User data retrieved');
    } catch (error) {
        next(error);
    }
};