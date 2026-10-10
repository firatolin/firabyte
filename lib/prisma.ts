import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Parse DATABASE_URL manually to avoid pg connection string parsing issues with Neon
const dbUrl = new URL(process.env.DATABASE_URL);

// Create a connection pool with Neon-compatible settings
const pool = new Pool({
  host: dbUrl.hostname,
  port: dbUrl.port ? parseInt(dbUrl.port, 10) : 5432,
  database: dbUrl.pathname.slice(1),
  user: dbUrl.username,
  password: dbUrl.password,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 20000,
  idleTimeoutMillis: 30000,
  max: 5,
  // Force IPv4 — Neon pooler sometimes has broken IPv6 routes
  // @ts-expect-error pg accepts family but typings don't always include it
  family: 4,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;