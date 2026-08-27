import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { ensureDB, connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import breakdownRoutes from './routes/breakdownRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

// Eagerly start DB connection (no await — background) for long-running servers.
// On serverless, this may not finish before a request, which is why ensureDB
// middleware below waits for it explicitly on each request.
connectDB().catch((err) => console.warn('Initial DB connect failed (will retry on request):', err.message));

const app = express();

// ==================== CORS ====================

app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
        ],
        credentials: true,
    })
);

// ==================== BODY PARSER ====================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ==================== DB READINESS (critical for serverless) ====================
// Every request MUST have MongoDB connected before running. Otherwise, mongoose
// query buffering kicks in and times out after 10s on cold starts / slow connects.
app.use('/api', ensureDB);

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'MedEquipAI API is running',
        timestamp: new Date().toISOString(),
    });
});

// ==================== API ROUTES ====================

app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/breakdowns', breakdownRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

// ==================== ERROR HANDLING ====================

app.use(notFound);
app.use(errorHandler);

export default app;