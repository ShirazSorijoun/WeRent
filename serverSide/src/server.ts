import https from 'https';
import http from 'http';
import fs from 'fs';
import initApp from './app';

initApp().then((app) => {
  // const port = process.env.PORT;
  // app.listen(port , ()=>{
  // console.log(`Listening on port ${port}`);
  // });

  if (process.env.NODE_ENV !== 'production') {
    console.log('Development mode');
    console.log(`Listening on port ${process.env.PORT}`);
    http.createServer(app).listen(process.env.PORT);
  } else {
    console.log('Production mode');
    const options2 = {
      key: fs.readFileSync('../../client-key.pem'),
      cert: fs.readFileSync('../../client-cert.pem'),
    };
    https.createServer(options2, app).listen(process.env.HTTPS_PORT);
  }
});
