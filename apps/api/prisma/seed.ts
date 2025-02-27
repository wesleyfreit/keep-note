import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { config } from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  config({ path: '.env.dev', override: true });
} else config();

const prisma = new PrismaClient({
  log: ['query'],
});

const seedAdmin = async () => {
  if (!process.env.USER_NAME || !process.env.USER_EMAIL || !process.env.USER_PASSWORD) {
    throw new Error(
      'Environment variables USER_NAME, USER_EMAIL and USER_PASSWORD must be set',
    );
  }

  await prisma.user.create({
    data: {
      emailVerified: true,
      name: process.env.USER_NAME,
      email: process.env.USER_EMAIL,
      passwordHash: await hash(process.env.USER_PASSWORD, 6),
    },
  });
};

const seed = async () => {
  await seedAdmin();
};

(async () => {
  try {
    await seed();
    prisma.$disconnect();
  } catch (error) {
    console.log(error);
    prisma.$disconnect();
  }
})();
