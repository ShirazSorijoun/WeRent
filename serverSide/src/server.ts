import initApp from "./app";
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
//import https from 'https';
import http from 'http';
//import fs from 'fs';




initApp().then((app)=>{

  const options = {
    definition: {
    openapi: "3.0.0",
    info: {
    title: "'WeRent' 2023 REST API",
    version: "1.0.1",
    description: "REST server including authentication using JWT and refresh token",
    },
    servers: [{url: "http://localhost:3000",},],
    },
    apis: ["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

  
    //const port = process.env.PORT;
    //app.listen(port , ()=>{
       //console.log(`Listening on port ${port}`);
    //});

    
    if (process.env.NODE_ENV !== "production") {
      console.log("Development mode");
      console.log(`Listening on port ${process.env.PORT}`);
      http.createServer(app).listen(process.env.PORT);
    }
    

    /*
    if (process.env.NODE_ENV !== 'production') {
      console.log('development');
      http.createServer(app).listen(process.env.PORT);
    } else {
      console.log('PRODUCTION');
      const options2 = {
        key: fs.readFileSync('../client-key.pem'),
        cert: fs.readFileSync('../client-cert.pem')
      };
      https.createServer(options2, app).listen(process.env.HTTPS_PORT);
    }
    */

});