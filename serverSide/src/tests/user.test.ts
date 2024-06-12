import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import initApp from '../app';
import User, { UserRole } from '../models/user_model';

let app: Express;
let accessTokenUser1: string;
let accessTokenUser2: string;
let user1Id: string;
let user2Id: string;
let user3Id: string;

const user1 = {
  name: 'testUser',
  email: 'test@test.com',
  password: 'test123',
  roles: UserRole.Admin,
};

const user2 = {
  name: 'Shani',
  email: 'shani@test.com',
  password: '123456',
  roles: UserRole.Owner,
};

const user3 = {
  name: 'John',
  email: 'John@test.com',
  password: '111111',
  roles: UserRole.Tenant,
};

beforeAll(async () => {
  app = await initApp();
  console.log('beforeAll');
  await User.deleteMany();

  await User.deleteMany({ email: user1.email });
  const res1 = await request(app).post('/auth/register').send(user1);
  user1Id = res1.body._id;
  // console.log(user1Id)
  const response = await request(app).post('/auth/login').send(user1);
  accessTokenUser1 = response.body.tokens.accessToken;
  // console.log(accessToken)

  await User.deleteMany({ email: user2.email });
  const res2 = await request(app).post('/auth/register').send(user2);
  user2Id = res2.body._id;
  const response2 = await request(app).post('/auth/login').send(user2);
  accessTokenUser2 = response2.body.tokens.accessToken;
  // console.log(accessToken2)

  await User.deleteMany({ email: user3.email });
  const res3 = await request(app).post('/auth/register').send(user3);
  user3Id = res3.body._id;
  await request(app).post('/auth/login').send(user3);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Controller Tests', () => {
  test('Test Get All Users', async () => {
    const response = await request(app)
      .get('/user/')
      .set('Authorization', `JWT ${accessTokenUser1}`);
    expect(response.statusCode).toBe(200);
  });

  test('Test Get All Users - not admin', async () => {
    const response = await request(app)
      .get('/user/')
      .set('Authorization', `JWT ${accessTokenUser2}`);
    expect(response.statusCode).toBe(401);
  });

  test('Test Get User by Email', async () => {
    const userEmail = user2.email;

    const response = await request(app)
      .get(`/user/${userEmail}`)
      .set('Authorization', `JWT ${accessTokenUser1}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(user2.name);
    expect(response.body._id).toBe(user2Id);
  });

  test('Get User by ID - Found (status 200)', async () => {
    const response = await request(app)
      .get(`/user/id/${user1Id}`)
      .set('Authorization', `JWT ${accessTokenUser1}`);

    expect(response.statusCode).toBe(200);
  });

  test('Get User by ID - Internal Server Error (status 500)', async () => {
    const invalidUserId = 'invalidUserId';
    const response = await request(app)
      .get(`/user/id/${invalidUserId}`)
      .set('Authorization', `JWT ${accessTokenUser1}`);

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe('Internal Server Error -> getUserById');
  });

  test('Test Update - Admin', async () => {
    const updateData = {
      id: user2Id,
      user: {
        name: 'Shani Yaish',
        email: 'update@gmail.com',
        password: '555555',
      },
    };

    const response = await request(app)
      .patch('/user/update')
      .set('Authorization', `JWT ${accessTokenUser1}`)
      .send(updateData);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Shani Yaish');
  });

  test('Test Update -without fields', async () => {
    const updateData = {
      id: user2Id,
      user: {
        name: '',
        email: '',
        password: '',
      },
    };

    const response = await request(app)
      .patch('/user/update')
      .set('Authorization', `JWT ${accessTokenUser1}`)
      .send(updateData);

    expect(response.statusCode).toBe(400);
  });

  test('Test Update -without data', async () => {
    const response = await request(app)
      .patch('/user/update')
      .set('Authorization', `JWT ${accessTokenUser1}`)
      .send();

    expect(response.statusCode).toBe(500);
  });

  test('Test Update - Not Admin', async () => {
    const updateData = {
      id: user1Id,
      user: {
        name: 'testtt',
        email: 'update@gmail.com',
        password: '55555',
      },
    };

    const response = await request(app)
      .patch('/user/update')
      .set('Authorization', `JWT ${accessTokenUser2}`)
      .send(updateData);

    expect(response.statusCode).toBe(401);
    expect(response.text).toBe('Not Admin');
  });

  test('Test Update User - User Not Found', async () => {
    const nonExistentUserId = '6592857c6341227f90e3fdd3';
    const updateData = {
      id: nonExistentUserId,
      user: {
        name: 'Updated Name',
        email: 'updated.email@example.com',
        password: 'updatedPassword123',
      },
    };

    const response = await request(app)
      .patch('/user/update')
      .set('Authorization', `JWT ${accessTokenUser1}`)
      .send(updateData);

    expect(response.statusCode).toBe(404);
  });

  test('Test Delete User by ID - Admin', async () => {
    const deleteResponse = await request(app)
      .delete(`/user/delete/${user3Id}`)
      .set('Authorization', `JWT ${accessTokenUser1}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('User deleted successfully');

    // Check that the user is really deleted by trying to fetch it
    const getUserResponse = await request(app)
      .get(`/user/id/${user3Id}`)
      .set('Authorization', `JWT ${accessTokenUser1}`);

    expect(getUserResponse.status).toBe(404);
  });

  test('Test Delete User by ID - Admin User Not Found', async () => {
    const deleteResponse = await request(app)
      .delete(`/user/delete/${user3Id}`)
      .set('Authorization', `JWT ${accessTokenUser1}`);

    expect(deleteResponse.status).toBe(404);
  });

  test('Test Update Own Profile - Success', async () => {
    const updateData = {
      id: user2Id,
      user: {
        name: 'Updated Name',
        email: 'updated.email@example.com',
        password: '8888888',
        profile_image: '',
      },
    };

    const response = await request(app)
      .patch('/user/updateOwnProfile')
      .set('Authorization', `JWT ${accessTokenUser2}`)
      .send(updateData);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Updated Name');

    // Check that the user's profile is updated
    const updatedUserResponse = await request(app)
      .get(`/user/id/${user2Id}`)
      .set('Authorization', `JWT ${accessTokenUser1}`);

    expect(updatedUserResponse.status).toBe(200);
    expect(updatedUserResponse.body.name).toBe('Updated Name');
  });

  test('Test Update Own Profile - without data', async () => {
    const updateData = {
      id: user2Id,
      user: {
        name: '',
        email: '',
        password: '',
        profile_image: '',
      },
    };

    const response = await request(app)
      .patch('/user/updateOwnProfile')
      .set('Authorization', `JWT ${accessTokenUser2}`)
      .send(updateData);

    expect(response.statusCode).toBe(400);
  });

  test('Test Check Old Password - Valid Password', async () => {
    const validOldPassword = 'test123';
    const response = await request(app)
      .post('/user/checkOldPassword')
      .set('Authorization', `JWT ${accessTokenUser1}`)
      .send({ oldPassword: validOldPassword });

    expect(response.body.isValid).toBe(true);
  });

  test('Test Check Old Password - Not Valid Password', async () => {
    const validOldPassword = '1';
    const response = await request(app)
      .post('/user/checkOldPassword')
      .set('Authorization', `JWT ${accessTokenUser1}`)
      .send({ oldPassword: validOldPassword });

    expect(response.body.isValid).toBe(false);
  });

  test('Test Check Old Password - Internal Server Error (status 500)', async () => {
    // Simulate an internal server error by not providing the old password
    const response = await request(app)
      .post('/user/checkOldPassword')
      .set('Authorization', `JWT ${accessTokenUser1}`)
      .send({});

    expect(response.status).toBe(500);
  });

  test('Test update role - success', async () => {
    const response = await request(app)
      .patch('/user/changeRole')
      .set('Authorization', `JWT ${accessTokenUser2}`)
      .send({ role: 'tenant' });

    expect(response.status).toBe(200);
  });
});
