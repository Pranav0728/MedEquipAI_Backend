import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET || 'medequipai_secret',
    JWT_EXPIRES_IN: '7d',
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    OPENAI_API_KEY: process.env.GROQ_API_KEY,  // alias for compat
};