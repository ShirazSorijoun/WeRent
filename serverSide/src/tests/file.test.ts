import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import initApp from '../app';

let app: Express;

beforeAll(async () => {
  app = await initApp();
  console.log('beforeAll');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('File Tests', () => {
  test('upload file', async () => {
    const filePath = `${__dirname}\\user_vector.png`;
    console.log(filePath);

    // app = await initApp();

    try {
      const response = await request(app)
        .post('/file?file=123.png')
        .attach('file', filePath);

      if (!response.body) {
        throw new Error('Response body is undefined');
      }
      console.log(response.body);

      expect(response.statusCode).toEqual(200);
      let { url } = response.body;
      console.log(url);

      url = url.replace(/^.*\/\/[^/]+/, '');
      const res = await request(app).get(url);
      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
      expect(1).toEqual(2);
    }
  });
});
