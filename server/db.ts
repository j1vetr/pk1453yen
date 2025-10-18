import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Normal PostgreSQL için pg driver (production için SSL devre dışı)
const sslConfig = process.env.NODE_ENV === 'production' ? { ssl: false } : {};

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ...sslConfig
});

export const db = drizzle(pool, { schema });
