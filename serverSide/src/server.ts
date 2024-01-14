import initApp from "./app";
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
//import http from "http";




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

    const port = process.env.PORT;
    app.listen(port , ()=>{
       console.log(`Listening on port ${port}`);
    });

    /*
    if (process.env.NODE_ENV !== "production") {
      console.log("Development mode");
      http.createServer(app).listen(process.env.PORT);
    }
    */

});