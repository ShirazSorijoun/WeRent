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

  describe('User Controller Tests', () => {

    test("Test Get All Users", async () => {
      const response = await request(app).get("/user");
      expect(response.statusCode).toBe(200);
    });

    test("Test Get User by ID ", async () => {
      const userId = "658d76c1accde9cdd0d12bda";
  
      const response = await request(app).get(`/user/id/${userId}`);
      expect(response.statusCode).toBe(200);
    });

    test("Test Get User by Email", async () => {
      const userEmail = "test@test.com";
  
      const response = await request(app).get(`/user/${userEmail}`);
      expect(response.statusCode).toBe(200);
    });
  
    test("Test Update User", async () => {
      const userId = "659083cbfa71947bfd646418";
      const updatedUserData = {
        name: "Yuval",
        email: "updated@test.com",
        password: "123",
      };
  
      const response = await request(app)
        .patch("/user/update")
        .send({ id: userId, user: updatedUserData });
  
      expect(response.statusCode).toBe(200);
    });

    test("Test Delete User", async () => {
      const userId = "659083acfa71947bfd646414";
  
      const response = await request(app).delete(`/user/delete?id=${userId}`);
      expect(response.statusCode).toBe(200);
    });
  });