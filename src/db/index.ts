import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import pg from "pg";
import * as schema from "./schema.js";

const { Pool } = pg;

export const createPool = () => {
  if (!process.env.DATABASE_URL) {
    console.warn(
      "WARNING: DATABASE_URL is not set. Database connection will fail.",
    );
  }
  const poolConfig: any = {
    connectionString: process.env.DATABASE_URL,
  };

  // Enable SSL for managed Postgres services that require it (Neon, Supabase, etc.).
  // Respect explicit PGSSLMODE or detect common cloud hosts.
  if (
    process.env.DATABASE_URL &&
    (process.env.DATABASE_URL.includes("sslmode=require") ||
      process.env.PGSSLMODE === "require" ||
      process.env.DATABASE_URL.includes(".neon."))
  ) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  return new Pool(poolConfig);
};

const pool = createPool();

export const db = drizzle(pool, { schema });
