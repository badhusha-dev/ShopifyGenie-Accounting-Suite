import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createDefaultUsers() {
  try {
    // Create admin user
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@shopifygenie.com' }
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: {
          email: 'admin@shopifygenie.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          isActive: true
        }
      });
      console.log('✅ Admin user created: admin@shopifygenie.com / admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create accounting user
    const accountingExists = await prisma.user.findUnique({
      where: { email: 'accounting@shopifygenie.com' }
    });

    if (!accountingExists) {
      const hashedPassword = await bcrypt.hash('accounting123', 10);
      await prisma.user.create({
        data: {
          email: 'accounting@shopifygenie.com',
          name: 'Accounting User',
          password: hashedPassword,
          role: 'ACCOUNTING',
          isActive: true
        }
      });
      console.log('✅ Accounting user created: accounting@shopifygenie.com / accounting123');
    } else {
      console.log('ℹ️  Accounting user already exists');
    }

    console.log('\n🎉 Default users are ready!');
    console.log('\nYou can now login with:');
    console.log('  - Email: admin@shopifygenie.com, Password: admin123');
    console.log('  - Email: accounting@shopifygenie.com, Password: accounting123');
  } catch (error) {
    console.error('❌ Error creating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultUsers();

