import mongoose from "mongoose";

// Cache the mongoose connection promise so it is reused across warm
// Vercel serverless function invocations (avoids re-connect overhead).
let cachedPromise = null;

export const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI environment variable is missing");
    }

    // Fast path: already fully connected (readyState 1 = connected).
    // Return the existing connection wrapped as promise so await is harmless.
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // If no in-flight promise yet, start the connection and cache the
    // promise itself (NOT the resolved value). Multiple concurrent requests
    // on cold-start will all await the SAME single underlying connect call.
    if (!cachedPromise) {
        cachedPromise = mongoose
            .connect(process.env.MONGO_URI, {
                // Serverless-friendly connection settings
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 10000,
                bufferCommands: false,
            })
            .then(() => {
                if (!connectDB._logged) {
                    console.log("✅ MongoDB connected (readyState=%s)", mongoose.connection.readyState);
                    connectDB._logged = true;
                }
                return mongoose.connection;
            })
            .catch((err) => {
                // Allow retry on next request.
                console.error("❌ MongoDB connection failed:", err.message);
                cachedPromise = null;
                throw err;
            });
    }

    // ALWAYS await the cached promise — even if the caller raced while
    // readyState was still 2 (CONNECTING). This is the critical guarantee.
    return cachedPromise;
};

// Middleware: ensure MongoDB is connected BEFORE running any route handler.
// With bufferCommands=false this is mandatory; mongoose will throw instead
// of silently buffering queries when disconnected.
export const ensureDB = async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("❌ DB readiness check failed:", err.message);
        res.status(503).json({
            success: false,
            message: "Database temporarily unavailable — please try again in a moment.",
        });
    }
};

export default connectDB;