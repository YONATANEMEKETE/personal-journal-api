import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/shared/db/prisma.js';

describe('Health & Plumbing Integration Test', () => {
  test('GET /health should return 200 OK', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'OK',
    });
  });

  test('Database connection should work through Prisma', async () => {
    // Assert we can query the database (should be empty but succeed)
    const users = await prisma.user.findMany();
    expect(users).toEqual([]);
  });
});
