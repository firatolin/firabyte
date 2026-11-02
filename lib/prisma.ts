import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a connection pool with Neon-compatible settings
// Use connection string directly - pg handles SSL via sslmode=require in the URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL?.replace('&uselibpqcompat=true', ''),
  connectionTimeoutMillis: 60000,
  idleTimeoutMillis: 60000,
  max: 10,
  // Force IPv4 — Neon pooler sometimes has broken IPv6 routes
  // @ts-expect-error pg accepts family but typings don't always include it
  family: 4,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;