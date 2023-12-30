import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models/user_model";

let app: Express;


const user = {
    name: "testUser",
    email: "test@test.com",
    password: "test123"
};


beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await User.deleteMany({'email': user.email});
});

afterAll(async () => {
  await mongoose.connection.close();
});


let accessToken: string;
describe ("Auth test", () => {
    test("Test Register", async () => {
        const response = await request(app).post("/auth/register").send(user);
        expect(response.statusCode).toBe(201);
    });

    test("Test Register exist email", async () => {
        const response = await request(app).post("/auth/register").send(user);
        expect(response.statusCode).toBe(406);
    });

    test("Test Register missing password", async () => {
        const response = await request(app).post("/auth/register").send({
            name: "testUser",
            email: "test@test.com"
        });
        expect(response.statusCode).toBe(400);
    });

    test("Test Register missing email", async () => {
        const response = await request(app).post("/auth/register").send({
            name: "testUser",
            password: "test123"
        });
        expect(response.statusCode).toBe(400);
    });

    test("Test Register missing name", async () => {
        const response = await request(app).post("/auth/register").send({
            email: "test@test.com",
            password: "test123"
        });
        expect(response.statusCode).toBe(400);
    });

    test("Test Login", async () => {
        const response = await request(app).post("/auth/login").send(user);
        expect(response.statusCode).toBe(200);
        accessToken = response.body.accessToken;
        expect(accessToken).toBeDefined();
    });

    test ("Test forbidden access without token", async () => {
        const response = await request(app).get("/user");
        expect(response.statusCode).toBe(401);
    });

    test ("Test access with valid token", async () => {
        const response = await request(app)
            .get("/user")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    });

    
    test ("Test access with invalid token", async () => {
        const response = await request(app)
            .get("/user")
            .set("Authorization", "JWT 1" + accessToken);
        expect(response.statusCode).toBe(401);
    });
    
});