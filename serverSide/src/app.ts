import express, { Express } from 'express';
import dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose';
import bodyParser from "body-parser";

import authRoute from "./routes/auth_route";

const initApp = (): Promise<Express> =>{
   const promise = new Promise<Express>((resolve) =>{
      const db = mongoose.connection;
      db.on('error', error=>{console.error(error)});
      db.once('open', ()=>console.log('connected to the database'));
      const url = process.env.DATABASE_URL;
      mongoose.connect(url!).then(() =>{
        const app=express();

        app.use(bodyParser.urlencoded({ extended: true, limit: '1mb'}));
        app.use(bodyParser.json());

        app.use("/auth", authRoute);
    
        resolve(app);
       });
     });
  return promise;
};

export default initApp;

