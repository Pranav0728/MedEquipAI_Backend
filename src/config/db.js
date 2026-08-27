import mongoose from "mongoose";

// Cache the mongoose connection promise so it is reused across
// warm Vercel serverless function invocations (prevents re-connects).
let cachedPromise = null;

export const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI environment variable is missing");
    }

    // Already connected or connecting: reuse.
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
        return mongoose.connection;
    }

    if (!cachedPromise) {
        cachedPromise = mongoose.connect(process.env.MONGO_URI, {
            // Serverless-friendly connection settings
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            bufferCommands: false,
        }).then(() => mongoose.connection);

        cachedPromise.catch((err) => {
            console.error("MongoDB connection failed:", err.message);
            // On serverless, never call process.exit(). Let the promise throw.
            cachedPromise = null;
        });
    }

    try {
        const conn = await cachedPromise;
        // Note: avoid spammy logs on every warm invocation
        if (mongoose.connection.readyState === 1 && !connectDB._logged) {
            console.log("✅ MongoDB connected");
            connectDB._logged = true;
        }
        return conn;
    } catch (err) {
        cachedPromise = null;
        throw err;
    }
};

// Middleware: ensure MongoDB is connected BEFORE running any route handler.
// This is critical for serverless: without it, mongoose queries buffer and
// time out (10s default) on cold starts if the DB isn't ready yet.
export const ensureDB = async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("❌ DB connection error:", err.message);
        res.status(503).json({
            success: false,
            message: "Database temporarily unavailable — please try again in a moment.",
        });
    }
};

export default connectDB;