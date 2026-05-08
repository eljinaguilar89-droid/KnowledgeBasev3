import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

const { Pool } = pg;

export const createPool = () => {
  if (!process.env.DATABASE_URL) {
    console.warn("WARNING: DATABASE_URL is not set. Database connection will fail.");
  }
  return new Pool({
    connectionString: process.env.DATABASE_URL,
  });
};

const pool = createPool();

export const db = drizzle(pool, { schema });
