import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
        console.error('JWT verify error:', error.message);
        return null;
    }
};