import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dns from 'dns';

// Force IPv4 resolution for Neon hosts. Node's default dns.lookup may return IPv6/unreachable addresses,
// causing ETIMEDOUT. Resolve to IPv4 explicitly.
const originalLookup = dns.lookup.bind(dns);
dns.lookup = ((hostname: string, options: any, callback?: any) => {
  if (typeof options === 'function') { callback = options; options = {}; }
  options = options || {};
  if (hostname && String(hostname).includes('neon.tech')) {
    dns.resolve4(hostname, (err, addresses) => {
      if (err || !addresses || !addresses.length) {
        return originalLookup(hostname, options, callback);
      }
      if (options && options.all) {
        callback(null, addresses.map((a) => ({ address: a, family: 4 })));
      } else {
        callback(null, addresses[0], 4);
      }
    });
    return;
  }
  return originalLookup(hostname, options, callback);
}) as any;

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