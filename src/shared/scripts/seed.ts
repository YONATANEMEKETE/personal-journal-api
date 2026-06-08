import 'dotenv/config';
import { prisma } from '../db/prisma.js';
import { logger } from '../utils/logger.js';

async function main() {
  logger.info('Seeding database...');

  await prisma.$transaction(async (tx) => {
    await tx.entryTag.deleteMany();
    await tx.journalEntry.deleteMany();
    await tx.tag.deleteMany();
    await tx.user.deleteMany();

    const alice = await tx.user.create({
      data: {
        name: 'Alice',
        email: 'alice@example.com',
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$hashedpassword',
      },
    });

    const bob = await tx.user.create({
      data: {
        name: 'Bob',
        email: 'bob@example.com',
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$hashedpassword',
      },
    });

    const grateful = await tx.tag.create({
      data: { userId: alice.id, name: 'grateful', color: 'AMBER' },
    });

    const anxious = await tx.tag.create({
      data: { userId: alice.id, name: 'anxious', color: 'RED' },
    });

    const reflective = await tx.tag.create({
      data: { userId: alice.id, name: 'reflective', color: 'INDIGO' },
    });

    const productive = await tx.tag.create({
      data: { userId: bob.id, name: 'productive', color: 'GREEN' },
    });

    const entry1 = await tx.journalEntry.create({
      data: {
        userId: alice.id,
        title: 'First real entry',
        content: 'Today I started building the journal API from scratch.',
        entryDate: new Date('2026-06-01'),
      },
    });

    const entry2 = await tx.journalEntry.create({
      data: {
        userId: alice.id,
        title: 'Rough day',
        content: 'Spent hours debugging a Prisma migration issue.',
        entryDate: new Date('2026-06-03'),
      },
    });

    const entry3 = await tx.journalEntry.create({
      data: {
        userId: alice.id,
        title: 'Milestone reached',
        content: 'All auth endpoints are working with session-based auth.',
        entryDate: new Date('2026-06-05'),
      },
    });

    const entry4 = await tx.journalEntry.create({
      data: {
        userId: bob.id,
        title: 'Project kickoff',
        content: 'Starting a new side project for inventory management.',
        entryDate: new Date('2026-06-02'),
      },
    });

    const entry5 = await tx.journalEntry.create({
      data: {
        userId: bob.id,
        title: 'Good progress',
        content: 'Got the basic CRUD working for assets.',
        entryDate: new Date('2026-06-04'),
      },
    });

    await tx.entryTag.createMany({
      data: [
        { entryId: entry1.id, tagId: grateful.id },
        { entryId: entry1.id, tagId: reflective.id },
        { entryId: entry2.id, tagId: anxious.id },
        { entryId: entry3.id, tagId: grateful.id },
        { entryId: entry3.id, tagId: productive.id },
        { entryId: entry4.id, tagId: productive.id },
        { entryId: entry5.id, tagId: productive.id },
      ],
    });
  });

  logger.info('Database seeded successfully');
}

main()
  .catch((error) => {
    logger.error(error, 'Seed failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
