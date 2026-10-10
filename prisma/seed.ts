import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the Prisma adapter
const adapter = new PrismaPg(pool);

// Create PrismaClient with the adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'firatolesayas@gmail.com';
  
  console.log('Checking for admin user...');
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    console.log('Creating admin user...');
    // Generate a secure random password
    const securePassword = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(securePassword, 12);
    
    await prisma.user.create({
      data: {
        name: 'Firatol Esayas Tefera',
        email: adminEmail,
        password: hashedPassword,
        bio: 'Full-Stack Software Engineer | AI Automation Engineer',
        role: 'ADMIN',
      },
    });
    
    console.log('✅ Admin user created!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${securePassword}`);
    console.log('⚠️  SAVE THIS PASSWORD - It will not be shown again!');
  } else {
    console.log('✅ Admin user already exists');
    console.log(`📧 Email: ${adminEmail}`);
  }
}

function generateSecurePassword(): string {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }
  
  // Ensure at least one of each required character type
  if (!/[a-z]/.test(password)) password = password.slice(0, -1) + 'a';
  if (!/[A-Z]/.test(password)) password = password.slice(0, -1) + 'A';
  if (!/[0-9]/.test(password)) password = password.slice(0, -1) + '1';
  if (!/[!@#$%^&*]/.test(password)) password = password.slice(0, -1) + '!';
  
  return password;
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });