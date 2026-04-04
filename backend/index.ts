import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { pool } from './config/database.js';

// Import routes
import indexRoutes from './routes/index.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Root route
app.get('/', (req, res) => {
    res.send('Hello from TypeScript backend!');
});

// API routes
app.use('/api', indexRoutes);

// 404 route
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// centralized error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err); // keep server-side logs, avoid leaking stack to clients in production
    const status = err.status || 500;
    const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : (err.message || 'Internal Server Error');
    res.status(status).json({ error: message });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});