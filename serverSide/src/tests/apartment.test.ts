import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User, { UserRole } from "../models/user_model";
import Apartment from "../models/apartment_model";

let app: Express;
let accessTokenUser1: string;
let accessTokenUser2: string;
let accessTokenUser3:string;
let user1Id: string;
let apartment1Id:string;
let apartment2Id:string;

const user1= {
    name: "testUser",
    email: "test@test.com",
    password: "test123",
    roles: UserRole.Owner,
  };

const user2= {
    name: "John",
    email: "John@test.com",
    password: "111111",
    roles: UserRole.Tenant
  };

const user3= {
    name: "Shani Yaish",
    email: "Shani@gmail.com",
    password: "123456",
    roles: UserRole.Admin
  };  

const apartment1={
    city: "Lod",
    address: "Barak 4",
    owner: "",
    floor: 2,
    rooms: 4,
    sizeInSqMeters: 105,
    entryDate: new Date("2023-02-01")
};

const apartment2={
  city: "Holon",
  address: "Harava 4",
  owner: "",
  floor: 6,
  rooms: 5,
  sizeInSqMeters: 120,
  entryDate: new Date("2024-06-15")
};

beforeAll(async () => {
    app = await initApp();
    console.log("beforeAll");
    await User.deleteMany();
    await Apartment.deleteMany();

    await User.deleteMany({ 'email': user1.email });
    const res1 = await request(app).post("/auth/register").send(user1);
    user1Id= res1.body._id;
    const response1 =await request(app).post("/auth/login").send(user1);
    accessTokenUser1 = response1.body.accessToken;

    await User.deleteMany({ 'email': user2.email });
    await request(app).post("/auth/register").send(user2);
    const response2 = await request(app).post("/auth/login").send(user2);
    accessTokenUser2 = response2.body.accessToken;

    await User.deleteMany({ 'email': user3.email });
    await request(app).post("/auth/register").send(user3);
    const response3 = await request(app).post("/auth/login").send(user3);
    accessTokenUser3 = response3.body.accessToken;
});


afterAll(async () => {
      await mongoose.connection.close();
});

describe('Apartment post Controller Tests', () => {

    test("Test Get All Apartments posts - empty response", async () => {
        const response = await request(app).get("/apartment");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
      });

    test("Test Post Apartment", async () => {
        const response = await request(app)
          .post("/apartment/create")
          .set("Authorization", "JWT " + accessTokenUser1)
          .send({ apartment: apartment1 });
        
        const response2 =   await request(app)
          .post("/apartment/create")
          .set("Authorization", "JWT " + accessTokenUser1)
          .send({ apartment: apartment2 });
        
        apartment1Id = response.body._id;
        apartment2Id = response2.body._id;
    
        expect(response.statusCode).toBe(201);
        expect(response.body.owner).toBe(user1Id);
        expect(response.body.city).toBe(apartment1.city);
        expect(response.body.address).toBe(apartment1.address);
      });

      test("Test Post Apartment - Tenant", async () => {
        const response = await request(app)
          .post("/apartment/create")
          .set("Authorization", "JWT " + accessTokenUser2)
          .send({ apartment: apartment1 });
        
    
        expect(response.statusCode).toBe(401);
        expect(response.text).toBe("Not Owner");
      });

    
      test("Test Get All Apartments", async () => {
        const response = await request(app).get("/apartment/");
        expect(response.statusCode).toBe(200);
      });

      test("Test Get My Apartments - Success", async () => {
        const response = await request(app).get("/user/apartments/")
        .set("Authorization", "JWT " + accessTokenUser1);
        const rc = response.body.myApartments[0];
        //console.log(rc)
        expect(response.statusCode).toBe(200);
        expect(rc.owner).toBe(user1Id);
      });

      test("Test Get My Apartments - Not Success", async () => {
        const response = await request(app).get("/user/apartments/")
        .set("Authorization", "JWT " + accessTokenUser2);
        expect(response.statusCode).toBe(401);
        expect(response.text).toBe('Not Owner');
      });

      test("Test Delete Apartment - Own Apartment ", async () => {
        const response = await request(app)
        .delete(`/apartment/delete/${apartment1Id}`)
        .set("Authorization", "JWT " + accessTokenUser1);
        expect(response.statusCode).toBe(200);
      });

      test("Test The apartment has been deleted from the array of user1", async () => {
        const response = await request(app)
        .get(`/user/apartments/`)
        .set("Authorization", "JWT " + accessTokenUser1);
        const rc = response.body.myApartments[0];
        
        expect(response.statusCode).toBe(200);
        expect(rc.city).toBe(apartment2.city);
      });

      test("Test Delete Apartment - Admin ", async () => {
        const response = await request(app)
        .delete(`/apartment/admin/delete/${apartment2Id}`)
        .set("Authorization", "JWT " + accessTokenUser3);
        expect(response.statusCode).toBe(200);
      });
});
