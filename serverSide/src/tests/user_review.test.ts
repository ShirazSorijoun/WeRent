import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import initApp from '../app';
import UserReview from '../models/user_review_model';
import { User } from '../models/user_model';

let app: Express;
let accessTokenUser: string;
let accessTokenUser2: string;
let accessTokenUser3: string;
let reviewId: string;
let review2Id: string;

const user = {
  name: 'Shiraz',
  email: 'test@test.com',
  password: 'test123',
};

const user2 = {
  name: 'John',
  email: 'John@gmail.com',
  password: '11111111',
};

const user3 = {
  name: 'Shani',
  email: 'shani@gmail.com',
  password: '123456',
};

const userReview = {
  userId: '',
  ownerName: '',
  description: 'Great!',
};

const userReview2 = {
  userId: '',
  ownerName: '',
  description: 'Hello World!',
};

beforeAll(async () => {
  app = await initApp();
  console.log('beforeAll');
  await User.deleteMany();
  await UserReview.deleteMany();

  const res = await request(app).post('/auth/register').send(user);
  userReview.ownerName = res.body.name;
  userReview.userId = res.body._id;
  userReview2.ownerName = res.body.name;
  userReview2.userId = res.body._id;
  const response = await request(app).post('/auth/login').send(user);
  accessTokenUser = response.body.tokens.accessToken;

  await request(app).post('/auth/register').send(user2);
  const response2 = await request(app).post('/auth/login').send(user2);
  accessTokenUser2 = response2.body.tokens.accessToken;

  await request(app).post('/auth/register').send(user3);
  const response3 = await request(app).post('/auth/login').send(user3);
  accessTokenUser3 = response3.body.tokens.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User review tests', () => {
  test('Test Get All User reviews - empty response', async () => {
    const response = await request(app).get('/userReview');
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test('Test create User review', async () => {
    // console.log("User Review to Send:", userReview);
    const response = await request(app)
      .post('/userReview/create')
      .set('Authorization', `JWT ${accessTokenUser}`)
      .send({ review: userReview });

    reviewId = response.body._id;

    const response2 = await request(app)
      .post('/userReview/create')
      .set('Authorization', `JWT ${accessTokenUser}`)
      .send({ review: userReview2 });

    review2Id = response2.body._id;

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject(userReview);
  });

  test('Test Delete Review - Not Found (status 404)', async () => {
    const nonExistentReviewId = '123456789012345678901234';
    const response = await request(app)
      .delete(`/userReview/admin/${nonExistentReviewId}`)
      .set('Authorization', `JWT ${accessTokenUser2}`);

    expect(response.statusCode).toBe(404);
  });

  test('Test delete User review By Admin', async () => {
    const response = await request(app)
      .delete(`/userReview/admin/${reviewId}`)
      .set('Authorization', `JWT ${accessTokenUser2}`);

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Review deleted successfully');
  });

  test('Test delete User review By not the owner of the review', async () => {
    const response = await request(app)
      .delete(`/userReview/${review2Id}`)
      .set('Authorization', `JWT ${accessTokenUser3}`);

    expect(response.statusCode).toBe(403);
    expect(response.text).toBe('Only owner can delete reviews');
  });

  test('Test delete User review By the owner of the review', async () => {
    const response = await request(app)
      .delete(`/userReview/${review2Id}`)
      .set('Authorization', `JWT ${accessTokenUser}`);

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Review deleted successfully');
  });
});
