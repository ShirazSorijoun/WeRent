import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import initApp from '../app';
import Apartment from '../models/apartment_model';
import { User } from '../models/user_model';

let app: Express;
let accessTokenUser1: string;
let accessTokenUser2: string;
let accessTokenUser3: string;
let user1Id: string;
let apartment1Id: string;
let apartment2Id: string;

const user1 = {
  name: 'testUser',
  email: 'test@test.com',
  password: 'test123',
};

const user2 = {
  name: 'John',
  email: 'John@test.com',
  password: '111111',
};

const user3 = {
  name: 'Shani Yaish',
  email: 'Shani@gmail.com',
  password: '123456',
};

const apartment1 = {
  city: 'Lod',
  address: 'Barak 4',
  type: 'Garden Apartment',
  owner: '',
  floor: 2,
  apartment_image: '',
  numberOfFloors: 4,
  rooms: 4,
  sizeInSqMeters: 105,
  price: 2500,
  entryDate: new Date('2023-02-01'),
  furniture: 'full',
  features: {
    parking: true,
    accessForDisabled: false,
    storage: true,
    dimension: false,
    terrace: true,
    garden: true,
    elevators: false,
    airConditioning: true,
  },
};

const apartment2 = {
  city: 'Holon',
  address: 'Harava 4',
  type: 'Apartment',
  owner: '',
  floor: 6,
  numberOfFloors: 8,
  rooms: 5,
  sizeInSqMeters: 120,
  price: 3000,
  entryDate: new Date('2024-06-15'),
  description: 'Apartment in an excellent location',
  features: {
    parking: false,
    accessForDisabled: true,
    storage: false,
    dimension: true,
    terrace: false,
    garden: true,
    elevators: true,
    airConditioning: false,
  },
  phone: '0524717657',
};

beforeAll(async () => {
  app = await initApp();
  console.log('beforeAll');
  await User.deleteMany();
  await Apartment.deleteMany();

  await User.deleteMany({ email: user1.email });
  const res1 = await request(app).post('/auth/register').send(user1);
  user1Id = res1.body._id;
  const response1 = await request(app).post('/auth/login').send(user1);
  accessTokenUser1 = response1.body.tokens.accessToken;

  await User.deleteMany({ email: user2.email });
  await request(app).post('/auth/register').send(user2);
  const response2 = await request(app).post('/auth/login').send(user2);
  accessTokenUser2 = response2.body.tokens.accessToken;

  await User.deleteMany({ email: user3.email });
  await request(app).post('/auth/register').send(user3);
  const response3 = await request(app).post('/auth/login').send(user3);
  accessTokenUser3 = response3.body.tokens.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Apartment post Controller Tests', () => {
  test('Test Get All Apartments posts - empty response', async () => {
    const response = await request(app).get('/apartment');
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test('Test Post Apartment', async () => {
    const response = await request(app)
      .post('/apartment/create')
      .set('Authorization', `JWT ${accessTokenUser1}`)
      .send({ apartment: apartment1 });

    const response2 = await request(app)
      .post('/apartment/create')
      .set('Authorization', `JWT ${accessTokenUser1}`)
      .send({ apartment: apartment2 });

    apartment1Id = response.body._id;
    apartment2Id = response2.body._id;

    expect(response.statusCode).toBe(201);
    expect(response.body.owner).toBe(user1Id);
    expect(response.body.city).toBe(apartment1.city);
    expect(response.body.address).toBe(apartment1.address);
  });

  test('Test Post Apartment - Tenant', async () => {
    const response = await request(app)
      .post('/apartment/create')
      .set('Authorization', `JWT ${accessTokenUser2}`)
      .send({ apartment: apartment1 });

    expect(response.statusCode).toBe(401);
    expect(response.text).toBe('Not Owner');
  });

  test('Test Get All Apartments', async () => {
    const response = await request(app).get('/apartment/');
    expect(response.statusCode).toBe(200);
  });

  test('Test Get My Apartments - Success', async () => {
    const response = await request(app)
      .get('/user/apartments/')
      .set('Authorization', `JWT ${accessTokenUser1}`);
    const rc = response.body.myApartments[0];
    // console.log( response.body)
    expect(response.statusCode).toBe(200);
    expect(rc.owner).toBe(user1Id);
  });

  test('Test Get My Apartments - Not Success', async () => {
    const response = await request(app)
      .get('/user/apartments/')
      .set('Authorization', `JWT ${accessTokenUser2}`);
    expect(response.statusCode).toBe(401);
    expect(response.text).toBe('Not Owner');
  });

  test('Get Apartment by ID - Found (status 200)', async () => {
    const response = await request(app)
      .get(`/apartment/${apartment1Id}`)
      .set('Authorization', `JWT ${accessTokenUser1}`);

    expect(response.status).toBe(200);
  });

  test('Get Apartment by ID - Internal Server Error (status 500)', async () => {
    const invalidApartmentId = 'invalidApartmentId';
    const response = await request(app)
      .get(`/apartment/${invalidApartmentId}`)
      .set('Authorization', `JWT ${accessTokenUser1}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
  });

  test('Test Delete Apartment - Own Apartment ', async () => {
    const response = await request(app)
      .delete(`/apartment/delete/${apartment1Id}`)
      .set('Authorization', `JWT ${accessTokenUser1}`);
    expect(response.statusCode).toBe(200);
  });

  test('Get Apartment by ID - Not Found (status 404)', async () => {
    const response = await request(app)
      .get(`/apartment/${apartment1Id}`)
      .set('Authorization', `JWT ${accessTokenUser1}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Apartment not found');
  });

  test('Test The apartment has been deleted from the array of user1', async () => {
    const response = await request(app)
      .get(`/user/apartments/`)
      .set('Authorization', `JWT ${accessTokenUser1}`);
    const rc = response.body.myApartments[0];

    expect(response.statusCode).toBe(200);
    expect(rc.city).toBe(apartment2.city);
  });

  test('Test Apdate Apartment - by admin', async () => {
    const updateData = {
      city: 'Updated City',
      address: 'Updated Address',
      floor: 3,
      numberOfFloors: 4,
      rooms: 3,
      sizeInSqMeters: 110,
      apartment_image: '',
      price: 3000,
      entryDate: '2024-08-01',
      furniture: 'full',
      features: {
        parking: true,
        accessForDisabled: false,
        storage: true,
        dimension: false,
        terrace: true,
        garden: true,
        elevators: false,
        airConditioning: true,
      },
      description: 'wow',
      phone: '0524717657',
    };

    const response = await request(app)
      .patch(`/apartment/update`)
      .set('Authorization', `JWT ${accessTokenUser3}`)
      .send({ id: apartment2Id, updatedApartment: updateData });

    expect(response.status).toBe(200);
  });

  test('Test Apdate Apartment - by owner', async () => {
    const updateData = {
      city: 'Updated City2',
      address: 'Updated Address2',
      floor: 3,
      numberOfFloors: 8,
      rooms: 3,
      sizeInSqMeters: 100,
      price: 2500,
      entryDate: '2024-08-01',
      features: {
        parking: false,
        accessForDisabled: true,
        storage: false,
        dimension: true,
        terrace: false,
        garden: true,
        elevators: true,
        airConditioning: false,
      },
      description: 'wow',
      phone: '0524717657',
    };

    const response = await request(app)
      .patch(`/apartment/update`)
      .set('Authorization', `JWT ${accessTokenUser1}`)
      .send({ id: apartment2Id, updatedApartment: updateData });

    expect(response.status).toBe(200);
  });

  test('Test Delete Apartment - Admin ', async () => {
    const response = await request(app)
      .delete(`/apartment/delete/${apartment2Id}`)
      .set('Authorization', `JWT ${accessTokenUser3}`);
    expect(response.statusCode).toBe(200);
  });

  test('Test The apartment has been deleted from the array of user1', async () => {
    const response = await request(app)
      .get(`/user/apartments/`)
      .set('Authorization', `JWT ${accessTokenUser1}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.myApartments).toStrictEqual([]);
  });

  test('Test Post Apartment - didnt fill in data for a new apartment ', async () => {
    const response = await request(app)
      .post('/apartment/create')
      .set('Authorization', `JWT ${accessTokenUser1}`)
      .send();

    apartment1Id = response.body._id;
    expect(response.statusCode).toBe(400);
  });

  test('Test Apdate Apartment - not found', async () => {
    const updateData = {
      city: 'Updated City2',
      address: 'Updated Address2',
      floor: 3,
      numberOfFloors: 8,
      rooms: 3,
      sizeInSqMeters: 100,
      price: 2500,
      entryDate: '2024-08-01',
      features: {
        parking: false,
        accessForDisabled: true,
        storage: false,
        dimension: true,
        terrace: false,
        garden: true,
        elevators: true,
        airConditioning: false,
      },
      description: 'wow',
      phone: '0524717657',
    };

    const response = await request(app)
      .patch(`/apartment/update`)
      .set('Authorization', `JWT ${accessTokenUser1}`)
      .send({ id: apartment2Id, updatedApartment: updateData });

    expect(response.status).toBe(404);
  });

  test('Test Delete Apartment - apartment not found ', async () => {
    const response = await request(app)
      .delete(`/apartment/delete/11111111`)
      .set('Authorization', `JWT ${accessTokenUser1}`);
    expect(response.statusCode).toBe(500);
  });
});
