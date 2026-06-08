import 'dotenv/config';
import { prisma } from '../db/prisma.js';

async function main() {
  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;
  console.log('Database reachable');
}

main()
  .catch((error) => {
    console.error('Database check failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
