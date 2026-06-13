import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/shared/db/prisma.js';
import { hashPassword } from '../src/shared/utils/password.js';

describe('Journal Entries Integration Tests', () => {
  // Helper function to register and log in a user during tests
  async function setupUserAndSession(name: string, email: string) {
    const hashedPassword = await hashPassword('Password123!');
    const user = await prisma.user.create({
      data: { name, email, passwordHash: hashedPassword },
    });

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email, password: 'Password123!' });

    return {
      user,
      cookie: loginRes.headers['set-cookie'],
    };
  }

  describe('CRUD Operations (Happy Path)', () => {
    test('should successfully create, read, update, and delete an entry', async () => {
      // 1. Arrange: Setup user and session
      const { user, cookie } = await setupUserAndSession(
        'Alice',
        'alice@example.com',
      );

      const newEntryPayload = {
        title: 'My First Entry',
        content: 'Today was a wonderful coding day.',
        entryDate: '2026-06-12',
      };

      // 2. Act & Assert: Create entry
      const createRes = await request(app)
        .post('/entries')
        .set('Cookie', cookie)
        .send(newEntryPayload);

      expect(createRes.status).toBe(201);
      expect(createRes.body.data).toHaveProperty('id');
      expect(createRes.body.data.title).toBe(newEntryPayload.title);
      expect(createRes.body.data.userId).toBe(user.id);

      const entryId = createRes.body.data.id;

      // 3. Act & Assert: Read specific entry
      const getRes = await request(app)
        .get(`/entries/${entryId}`)
        .set('Cookie', cookie);

      expect(getRes.status).toBe(200);
      expect(getRes.body.data.content).toBe(newEntryPayload.content);

      // 4. Act & Assert: List entries
      const listRes = await request(app).get('/entries').set('Cookie', cookie);

      expect(listRes.status).toBe(200);
      expect(listRes.body.data.items.length).toBe(1);
      expect(listRes.body.data.items[0].id).toBe(entryId);

      // 5. Act & Assert: Update entry
      const updatePayload = {
        title: 'Updated Title',
        content: 'Even better content.',
      };

      const updateRes = await request(app)
        .patch(`/entries/${entryId}`)
        .set('Cookie', cookie)
        .send(updatePayload);

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.title).toBe(updatePayload.title);

      // 6. Act & Assert: Delete entry
      const deleteRes = await request(app)
        .delete(`/entries/${entryId}`)
        .set('Cookie', cookie);

      expect(deleteRes.status).toBe(204); // No Content

      // Verify deletion in DB
      const dbCheck = await prisma.journalEntry.findUnique({
        where: { id: entryId },
      });
      expect(dbCheck).toBeNull();
    });
  });

  describe('Multi-Tenant Access Isolation (Security Audit / Negative Path)', () => {
    test("Security Audit: should block User A from reading, modifying, or deleting User B's entry", async () => {
      // 1. Arrange: Create two separate users with active session cookies
      const { user: userA, cookie: cookieA } = await setupUserAndSession(
        'User A',
        'usera@example.com',
      );
      const { user: userB, cookie: cookieB } = await setupUserAndSession(
        'User B',
        'userb@example.com',
      );

      // Seed an entry belonging to User B
      const entryB = await prisma.journalEntry.create({
        data: {
          title: 'User B Secret Journal',
          content: 'This is private information.',
          entryDate: new Date('2026-06-12'),
          userId: userB.id,
        },
      });

      // 2. Act & Assert: User A tries to GET User B's entry
      const getRes = await request(app)
        .get(`/entries/${entryB.id}`)
        .set('Cookie', cookieA); // Authenticated as User A

      expect(getRes.status).toBe(404); // Returns 404 Not Found to prevent data discovery leaks
      expect(getRes.body.error.code).toBe('NOT_FOUND');

      // 3. Act & Assert: User A tries to PATCH User B's entry
      const patchRes = await request(app)
        .patch(`/entries/${entryB.id}`)
        .set('Cookie', cookieA)
        .send({ title: 'Hacked Title' });

      expect(patchRes.status).toBe(404);

      // Verify DB: Check that User B's entry title was NOT changed
      const dbCheckAfterPatch = await prisma.journalEntry.findUnique({
        where: { id: entryB.id },
      });
      expect(dbCheckAfterPatch!.title).toBe('User B Secret Journal');

      // 4. Act & Assert: User A tries to DELETE User B's entry
      const deleteRes = await request(app)
        .delete(`/entries/${entryB.id}`)
        .set('Cookie', cookieA);

      expect(deleteRes.status).toBe(404);

      // Verify DB: Check that User B's entry is still safely stored in the database
      const dbCheckAfterDelete = await prisma.journalEntry.findUnique({
        where: { id: entryB.id },
      });
      expect(dbCheckAfterDelete).not.toBeNull();
    });
  });

  describe('Authentication Guards', () => {
    test('should reject any journal entry action if request is completely unauthenticated', async () => {
      const response = await request(app).get('/entries');
      expect(response.status).toBe(401); // Unauthorized
    });
  });
});
