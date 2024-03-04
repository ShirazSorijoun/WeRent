import express, { Express } from 'express';
import dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import cors from 'cors';
import authRoute from "./routes/auth_route";
import userRoute from "./routes/user_route";
import apartmentRoute from "./routes/apartment_route";
import userReviewRoute from "./routes/user_review_route";
import fileRoute from "./routes/file_route";

const initApp = (): Promise<Express> =>{
   const promise = new Promise<Express>((resolve) =>{
      const db = mongoose.connection;
      db.on('error', error=>{console.error(error)});
      db.once('open', ()=>console.log('connected to the database'));
      const url = "mongodb://127.0.0.1/WeRent";
      mongoose.connect(url!).then(() =>{
        const app=express();

        app.use(bodyParser.urlencoded({ extended: true, limit: '1mb'}));
        app.use(bodyParser.json());

        // Enable CORS for all routes
        app.use(cors());


        app.use("/auth", authRoute);
        app.use("/user", userRoute);
        app.use("/apartment", apartmentRoute);
        app.use("/userReview", userReviewRoute);
        app.use("/file", fileRoute);
        app.use("/public", express.static("public"));
    
        resolve(app);
       });
     });
  return promise;
};

export default initApp;

