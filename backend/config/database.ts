import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';

// Database Configuration - supports external (Render) and local databases
const config: pg.PoolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
};

console.log('✅ Database pool initialized');
    
export const pool = new pg.Pool(config);
