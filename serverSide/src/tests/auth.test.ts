import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";

let app: Express;
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
});

afterAll(async () => {
  await mongoose.connection.close();
});


describe ("Auth test", () => {
    test("Test Register", async () => {
        const response = await request(app).post("/auth/register").send({
            username: "test@test.com",
            password: "test123"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({ message: "OK" });
    });

    test("Test Login", async () => {
        const response = await request(app).post("/auth/login").send({
            username: "test@test.com",
            password: "test123"
        });
        expect(response.statusCode).toBe(200);
    });


});