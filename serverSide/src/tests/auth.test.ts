import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models/user_model";

let app: Express;
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});


describe ("Auth test", () => {
    test("Test Register", async () => {
        const response = await request(app).post("/auth/register").send({
            name: "test",
            email: "test@test.com",
            password: "test123"
        });
        expect(response.statusCode).toBe(201);
    });

    test("Test Register exist email", async () => {
        const response = await request(app).post("/auth/register").send({
            name: "test",
            email: "test@test.com",
            password: "test123"
        });
        expect(response.statusCode).toBe(406);
    });

    test("Test Register missing password", async () => {
        const response = await request(app).post("/auth/register").send({
            name: "test",
            email: "test@test.com"
        });
        expect(response.statusCode).toBe(400);
    });

    test("Test Register missing email", async () => {
        const response = await request(app).post("/auth/register").send({
            name: "test",
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
        const response = await request(app).post("/auth/login").send({
            name: "test",
            email: "test@test.com",
            password: "test123"
        });
        expect(response.statusCode).toBe(200);
        const token = response.body.accessToken;
        expect(token).toBeDefined();
    });


});