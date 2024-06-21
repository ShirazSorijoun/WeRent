import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import initApp from '../app';
import User, { UserRole } from '../models/user_model';
// import { UserRole } from "../models/user_model";

let app: Express;

const user = {
  name: 'testUser',
  email: 'test@test.com',
  password: 'test123',
  roles: UserRole.Admin,
};

beforeAll(async () => {
  app = await initApp();
  console.log('beforeAll');
  await User.deleteMany({ email: user.email });
});

afterAll(async () => {
  await mongoose.connection.close();
});

let accessToken: string;
let refreshToken: string;

describe('Auth test', () => {
  test('Test Register', async () => {
    const response = await request(app).post('/auth/register').send(user);
    expect(response.statusCode).toBe(201);
  });

  test('Test Register - Missing Fields (status 400)', async () => {
    const response = await request(app).post('/auth/register').send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe('missing email or password or name or role');
  });

  test('Test Register - Invalid Name Format (status 400)', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'Invalid@Name',
      email: 'test@example.com',
      password: 'password',
      roles: 'user',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid name format');
  });

  test('Test Register - Invalid Email Format (status 400)', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'TestUser',
      email: 'invalidemail',
      password: 'password',
      roles: 'user',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid email format.');
  });

  test('Test Register exist email', async () => {
    const response = await request(app).post('/auth/register').send(user);
    expect(response.statusCode).toBe(406);
  });

  test('Test Register missing password', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'testUser',
      email: 'test@test.com',
    });
    expect(response.statusCode).toBe(400);
  });

  test('Test Register missing email', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'testUser',
      password: 'test123',
    });
    expect(response.statusCode).toBe(400);
  });

  test('Test Register missing name', async () => {
    const response = await request(app).post('/auth/register').send({
      email: 'test@test.com',
      password: 'test123',
    });
    expect(response.statusCode).toBe(400);
  });

  test('Test Register short password', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'Short',
      email: 'Short@test.com',
      password: '11',
    });
    expect(response.statusCode).toBe(400);
  });

  test('Test Login', async () => {
    const response = await request(app).post('/auth/login').send(user);
    expect(response.statusCode).toBe(200);
    accessToken = response.body.tokens.accessToken;
    refreshToken = response.body.tokens.refreshToken;
    expect(accessToken).toBeDefined();
  });

  test('Test Login - Missing Fields (status 400)', async () => {
    const response = await request(app).post('/auth/login').send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe('missing email or password or name');
  });

  test('Test Login - Incorrect Email or Password (status 401)', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'incorrectpassword',
      name: 'NonexistentUser',
    });

    expect(response.status).toBe(401);
    expect(response.text).toBe('email or password incorrect');
  });

  test('Test Check Token - Valid Token', async () => {
    const response = await request(app)
      .post('/auth/checkToken')
      .send({ token: accessToken });

    expect(response.status).toBe(200);
    expect(response.body.isValidToken).toBe(true);
  });

  test('Test forbidden access without token', async () => {
    const response = await request(app).get('/user');
    expect(response.statusCode).toBe(401);
  });

  test('Test access with valid token', async () => {
    const response = await request(app)
      .get('/user')
      .set('Authorization', `JWT ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  test('Test access with invalid token', async () => {
    const response = await request(app)
      .get('/user')
      .set('Authorization', `JWT 1${accessToken}`);
    expect(response.statusCode).toBe(401);
  });

  jest.setTimeout(10000);

  test('Test access after timeout of token', async () => {
    await new Promise((resolve) => {
      setTimeout(() => resolve('done'), 5000);
    });

    const response = await request(app)
      .get('/user')
      .set('Authorization', `JWT ${accessToken}`);
    expect(response.statusCode).not.toBe(200);
  });

  test('Test refresh token', async () => {
    const response = await request(app)
      .get('/auth/refresh')
      .set('Authorization', `JWT ${refreshToken}`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    const newAccessToken = response.body.accessToken;

    const response2 = await request(app)
      .get('/user')
      .set('Authorization', `JWT ${newAccessToken}`);
    expect(response2.statusCode).toBe(200);
  });

  test('Refresh Token - Missing Authorization Header (status 401)', async () => {
    const response = await request(app).get('/auth/refresh');

    expect(response.status).toBe(401);
  });

  test('Refresh Token - Invalid Authorization Header (status 401)', async () => {
    const response = await request(app)
      .get('/auth/refresh')
      .set('Authorization', 'InvalidHeader');

    expect(response.status).toBe(401);
  });

  test('Test Check Token - InValid Token', async () => {
    const response = await request(app)
      .post('/auth/checkToken')
      .send({ token: accessToken });

    expect(response.status).toBe(403);
  });

  test('Test Check Token - No Token Provided', async () => {
    const response = await request(app).post('/auth/checkToken').send({});

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No token provided');
  });

  test('Test Logout - Missing Authorization Header (status 401)', async () => {
    const response = await request(app).get('/auth/logout');

    expect(response.status).toBe(401);
  });

  test('Test Logout - Invalid Refresh Token (status 401)', async () => {
    const invalidRefreshToken = 'invalidtoken';
    const response = await request(app)
      .get('/auth/logout')
      .set('Authorization', `Bearer ${invalidRefreshToken}`);

    expect(response.status).toBe(401);
  });

  test('Test Logout - Successful Logout (status 200)', async () => {
    const response = await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
  });

  test('Google Signin - Missing Credential (status 400)', async () => {
    const response = await request(app).post('/auth/google').send();

    expect(response.status).toBe(400);
  });
});
