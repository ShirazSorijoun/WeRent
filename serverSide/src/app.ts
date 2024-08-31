import express, { Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import path from 'path';
import { engine } from 'express-handlebars'; // Import the engine function
import {
  authRoute,
  userRoute,
  apartmentRoute,
  userReviewRoute,
  fileRoute,
  tenantFormRoute,
  leaseAgreementRoute,
  matchRoute,
} from './routes';

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "'WeRent' 2023 REST API",
      version: '1.0.1',
      description:
        'REST server including authentication using JWT and refresh token',
    },
    servers: [{ url: `http://localhost:3000` }],
  },
  apis: ['./src/routes/*.ts'],
};
const specs = swaggerJsDoc(options);

const initApp = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.on('error', (error) => {
      console.error(error);
    });
    db.once('open', () => {
      console.log('connected to the database');
    });

    const url = process.env.DATABASE_URL;
    mongoose.connect(url!).then(() => {
      const app = express();

      app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
      app.use(bodyParser.json({ limit: '50mb' }));

      // Enable CORS for all routes
      app.use(cors());

      // Configure Handlebars
      // Configure Handlebars with prototype property access allowed
      app.engine(
        'handlebars',
        engine({
          extname: '.handlebars',
          helpers: {},
          runtimeOptions: {
            allowProtoPropertiesByDefault: true,
          },
        }),
      );
      app.set('view engine', 'handlebars');
      app.set('views', path.join(__dirname, '../views')); // Set the views directory

      // Define your routes
      app.use('/auth', authRoute);
      app.use('/user', userRoute);
      app.use('/apartment', apartmentRoute);
      app.use('/userReview', userReviewRoute);
      app.use('/file', fileRoute);
      app.use('/tenantForm', tenantFormRoute);
      app.use('/leaseAgreement', leaseAgreementRoute);
      app.use('/match', matchRoute);
      app.use('/public', express.static('public'));

      // Swagger UI
      app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
      app.use('/assets', express.static('static/assets'));

      // Catch-all Route
      app.use('*', (req, res) => {
        res.sendFile('index.html', { root: 'static/' });
      });

      resolve(app);
    });
  });
  return promise;
};

export default initApp;
