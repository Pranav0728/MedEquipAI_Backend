import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { config } from './config/config.js';

dotenv.config();
connectDB();

const PORT = config.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
});