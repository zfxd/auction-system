import express from 'express';
import router from './controllers';

const server = express();

// allow routes to parse JSON from the request
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// specify prefix for the routes implemented in controllers.ts
server.use('/', router);

// start the server
server.listen(3000, () => {
  console.log('Server started on port 3000');
});