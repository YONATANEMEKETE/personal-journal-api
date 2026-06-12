import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/shared/db/prisma.js';
import { hashPassword } from '../src/shared/utils/password.js';

describe('Authetication Integration Test', () => {
  const testUser = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'SecurePassword123!',
  };
  // NOTE: Register test cases
  describe('POST /auth/register', () => {
    test('Happy Path: should successfully register a new user and set session cookie', async () => {
      const response = await request(app).post('/auth/register').send(testUser);
      // Assert HTTP Response Status
      expect(response.status).toBe(201);

      // Assert Response Body (ensure password hash is NEVER leaked!)
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(testUser.name);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data).not.toHaveProperty('passwordHash');
      // Assert Session Cookie is returned in headers
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('connect.sid');
      // Assert User was actually written to the PostgreSQL database
      const userInDb = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      expect(userInDb).not.toBeNull();
      expect(userInDb!.name).toBe(testUser.name);
    });
    //
    test('Negative Path: should reject registration if email format is invalid', async () => {
      const invalidUser = {
        name: 'Jane Doe',
        email: 'not-an-email',
        password: 'SecurePassword123!',
      };
      const response = await request(app)
        .post('/auth/register')
        .send(invalidUser);
      expect(response.status).toBe(400); // Bad Request from Zod validation
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
    //
    test('Negative Path: should reject registration if email is already taken', async () => {
      // 1. Arrange: Manually insert a user into the DB
      const hashedPassword = await hashPassword(testUser.password);
      await prisma.user.create({
        data: {
          name: testUser.name,
          email: testUser.email,
          passwordHash: hashedPassword,
        },
      });
      // 2. Act: Try to register with the same email
      const response = await request(app).post('/auth/register').send(testUser);
      // 3. Assert: Verify conflict status code
      expect(response.status).toBe(409); // Conflict
      expect(response.body.error.code).toBe('CONFLICT');
      expect(response.body.error.message).toBe(
        'A user with this email already exists',
      );
    });
  });

  //  NOTE: Login Test Cases
  describe('POST /auth/login', () => {
    test('Happy Path: should authenticate user and return session cookie', async () => {
      // 1. Arrange: Seed a user directly in the database
      const hashedPassword = await hashPassword(testUser.password);
      await prisma.user.create({
        data: {
          name: testUser.name,
          email: testUser.email,
          passwordHash: hashedPassword,
        },
      });
      // 2. Act: Request login
      const response = await request(app).post('/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });
      // 3. Assert
      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();
    });
    //
    test('Negative Path: should reject login with wrong password', async () => {
      // 1. Arrange: Seed user
      const hashedPassword = await hashPassword(testUser.password);
      await prisma.user.create({
        data: {
          name: testUser.name,
          email: testUser.email,
          passwordHash: hashedPassword,
        },
      });
      // 2. Act: Request login with incorrect password
      const response = await request(app).post('/auth/login').send({
        email: testUser.email,
        password: 'WrongPassword!',
      });
      // 3. Assert
      expect(response.status).toBe(401); // Unauthorized
      expect(response.body.error.code).toBe('UNAUTHORIZED');
      expect(response.body.error.message).toContain(
        'Invalid email or password',
      );
    });
  });
  // NOTE: Profile & Logout Test Cases
  describe('GET /auth/me & POST /auth/logout', () => {
    test('Happy Path: should get active profile and logout successfully', async () => {
      // 1. Arrange: Seed user and log them in to get a valid session cookie
      const hashedPassword = await hashPassword(testUser.password);
      const user = await prisma.user.create({
        data: {
          name: testUser.name,
          email: testUser.email,
          passwordHash: hashedPassword,
        },
      });
      const loginRes = await request(app).post('/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      const sessionCookie = loginRes.headers['set-cookie'];
      // 2. Act (profile lookup): Pass the session cookie
      const meRes = await request(app)
        .get('/auth/me')
        .set('Cookie', sessionCookie);
      // Assert profile lookup succeeded
      expect(meRes.status).toBe(200);
      expect(meRes.body.data.id).toBe(user.id);
      // 3. Act (logout): Log out using the session cookie
      const logoutRes = await request(app)
        .post('/auth/logout')
        .set('Cookie', sessionCookie);
      // Assert logout succeeded
      expect(logoutRes.status).toBe(204); // No Content
      // 4. Act (verification): Request profile again with the now-invalid cookie
      const meAfterLogoutRes = await request(app)
        .get('/auth/me')
        .set('Cookie', sessionCookie);
      // Assert request is now rejected
      expect(meAfterLogoutRes.status).toBe(401);
    });
    test('Negative Path: should block access to /auth/me if unauthenticated', async () => {
      const response = await request(app).get('/auth/me');
      expect(response.status).toBe(401);
    });
  });
});
