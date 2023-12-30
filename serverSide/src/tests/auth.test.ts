import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models/user_model";
//import { UserRole } from "../models/user_model";


let app: Express;


const user = {
    name: "testUser",
    email: "test@test.com",
    password: "test123",
    roles: "admin"
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
let refreshToken: string;


describe ("Auth test", () => {
    test("Test Register", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send(user);
        expect(response.statusCode).toBe(201);
    });

    test("Test Register exist email", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send(user);
        expect(response.statusCode).toBe(406);
    });

    test("Test Register missing password", async () => {
        const response = await request(app)
            .post("/auth/register").send({
                name: "testUser",
                email: "test@test.com"
            });
        expect(response.statusCode).toBe(400);
    });

    test("Test Register missing email", async () => {
        const response = await request(app)
            .post("/auth/register").send({
                name: "testUser",
                password: "test123"
            });
        expect(response.statusCode).toBe(400);
    });

    test("Test Register missing name", async () => {
        const response = await request(app)
            .post("/auth/register").send({
                email: "test@test.com",
                password: "test123"
            });
        expect(response.statusCode).toBe(400);
    });

    test("Test Login", async () => {
        const response = await request(app)
            .post("/auth/login").send(user);
        expect(response.statusCode).toBe(200);
        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;
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
    
    jest.setTimeout(10000);
    
    test ("Test access after timeout of token", async () => {
        await new Promise(resolve => setTimeout(() => resolve("done"), 5000));

        const response = await request(app)
            .get("/user")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).not.toBe(200);
    });

    test ("Test refresh token", async () => {
        const response = await request(app)
            .get("/auth/refresh")
            .set("Authorization", "JWT " + refreshToken)
            .send();
        expect(response.statusCode).toBe(200);
        expect (response.body.accessToken).toBeDefined();
        expect (response.body.refreshToken).toBeDefined();

        const newAccessToken = response.body.accessToken;

        const response2 = await request(app)
            .get("/user")
            .set("Authorization", "JWT " + newAccessToken);
        expect(response2.statusCode).toBe(200);
    });

});