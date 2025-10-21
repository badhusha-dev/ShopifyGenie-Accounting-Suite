import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DEFAULT_ACCOUNTS } from '@shopifygenie/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@shopifygenie.com' },
    update: {},
    create: {
      email: 'admin@shopifygenie.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create default chart of accounts
  for (const account of DEFAULT_ACCOUNTS) {
    await prisma.account.upsert({
      where: { code: account.code },
      update: {},
      create: {
        code: account.code,
        name: account.name,
        type: account.type as any,
        isActive: true,
      },
    });
  }

  console.log('✅ Chart of accounts initialized');

  // Create sample tax rates
  const taxRates = [
    {
      name: 'US Sales Tax',
      rate: 0.0825, // 8.25%
      jurisdiction: 'United States',
    },
    {
      name: 'CA GST',
      rate: 0.05, // 5%
      jurisdiction: 'Canada',
    },
    {
      name: 'EU VAT',
      rate: 0.20, // 20%
      jurisdiction: 'European Union',
    },
  ];

  for (const taxRate of taxRates) {
    await prisma.taxRate.upsert({
      where: {
        name_jurisdiction: {
          name: taxRate.name,
          jurisdiction: taxRate.jurisdiction,
        },
      },
      update: {},
      create: taxRate,
    });
  }

  console.log('✅ Tax rates created');

  // Create sample exchange rates
  const exchangeRates = [
    {
      fromCurrency: 'USD',
      toCurrency: 'CAD',
      rate: 1.35,
      date: new Date(),
    },
    {
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      rate: 0.85,
      date: new Date(),
    },
    {
      fromCurrency: 'USD',
      toCurrency: 'GBP',
      rate: 0.75,
      date: new Date(),
    },
  ];

  for (const rate of exchangeRates) {
    await prisma.exchangeRate.upsert({
      where: {
        fromCurrency_toCurrency_date: {
          fromCurrency: rate.fromCurrency,
          toCurrency: rate.toCurrency,
          date: rate.date,
        },
      },
      update: {},
      create: rate,
    });
  }

  console.log('✅ Exchange rates created');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
