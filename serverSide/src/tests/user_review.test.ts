import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User, { UserRole } from "../models/user_model";
import UserReview from "../models/user_review_model";


let app: Express;
let accessTokenUser: string;

const user= {
    name: "Shiraz",
    email: "test@test.com",
    password: "test123",
    roles: UserRole.Admin,
};


const userReview={
    userId: "",
    ownerName: user.name,
    description: "Great!",
};



beforeAll(async () => {
    app = await initApp();
    console.log("beforeAll");
    await User.deleteMany();
    await UserReview.deleteMany();

    const res = await request(app).post("/auth/register").send(user);
    userReview.userId = res.body._id;
    console.log(user);
    accessTokenUser = res.body.accessToken;
    //const response =await request(app).post("/auth/login").send(user);
    console.log(userReview);
});


afterAll(async () => {
    await mongoose.connection.close();
});


describe('User review tests', () => {

    /*
    test("Test Get All User reviews - empty response", async () => {
        const response = await request(app).get("/userReview");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    });

   
    test("Test create User review", async () => {
        const response = await request(app).post("/userReview").send(userReview);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(userReview);
    });
    */

    test("Test create User review", async () => {
        const response = await request(app)
        .post("/userReview/create")
        .set("Authorization", "JWT " + accessTokenUser)
        .send({ userReview: userReview });
        console.log(response.body);
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject(userReview);

        /*
        expect(response.body.userId).toBe(userReview.userId);
        expect(response.body.ownerName).toBe(userReview.ownerName);
        expect(response.body.description).toBe(userReview.description);
        */
    });


    test("Test delete User review", async () => {
        //const reviewId = ; //id_of_the_review_to_delete
      
        const response = await request(app).delete(`/userReview/${reviewId}`);
      
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'Review deleted successfully' });
      });


});