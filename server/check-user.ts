import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@shopifygenie.com' }
  });

  if (user) {
    console.log('✅ User found:', user.email);
    console.log('  - Name:', user.name);
    console.log('  - Role:', user.role);
    console.log('  - Active:', user.isActive);
    console.log('  - Password hash length:', user.password.length);
    
    // Test password
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log('  - Password "admin123" valid:', isValid);
  } else {
    console.log('❌ User not found');
  }

  await prisma.$disconnect();
}

checkUser();

