import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User, { UserRole } from "../models/user_model";

let app: Express;
let accessToken: string;
let accessToken2: string;

const user= {
  name: "testUser",
  email: "test@test.com",
  password: "test123",
  roles: UserRole.Admin
};

const user2= {
  name: "Shani",
  email: "shani@test.com",
  password: "123456",
  roles: UserRole.Owner
};



beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");

  User.deleteMany({ 'email': user.email });
  await request(app).post("/auth/register").send(user);
  const response2 = await request(app).post("/auth/login").send(user);
  accessToken = response2.body.accessToken;
  //console.log(accessToken)

  User.deleteMany({ 'email': user2.email });
  await request(app).post("/auth/register").send(user2);
  const response = await request(app).post("/auth/login").send(user2);
  accessToken2 = response.body.accessToken;
  //console.log(accessToken2)
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('User Controller Tests', () => {

    test("Test Get All Users", async () => {
      const response = await request(app).get("/user/")
      .set("Authorization", "JWT " + accessToken);
      expect(response.statusCode).toBe(200);
    });

    test("Test Get All Users - not admin", async () => {
      const response = await request(app).get("/user/")
      .set("Authorization", "JWT " + accessToken2);
      expect(response.statusCode).toBe(401);
    });

    test("Test Get User by Email", async () => {
      const userEmail = user2.email;
  
      const response = await request(app).get(`/user/${userEmail}`)
      .set("Authorization", "JWT " + accessToken);
      expect(response.statusCode).toBe(200);
    });
    

  });