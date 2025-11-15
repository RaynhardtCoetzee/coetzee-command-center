import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@coetzee.dev' },
    update: {},
    create: {
      email: 'demo@coetzee.dev',
      name: 'Demo User',
      password: await hash('demo123', 10),
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

