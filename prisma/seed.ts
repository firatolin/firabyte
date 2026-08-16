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
  // Check if admin user exists
  const adminEmail = 'firatolesayas@gmail.com'; // 👈 Updated email
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
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
    console.log(`🔑 Password: admin123`);
  } else {
    console.log('✅ Admin user already exists');
    console.log(`📧 Email: ${adminEmail}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });