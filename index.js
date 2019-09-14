const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const socketioJwt = require('socketio-jwt');

require('dotenv').config();

process.env.TZ = 'America/Guayaquil'; // zona horaria de la app

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cors());
app.set('view engine', 'ejs');

// public files
app.use(express.static('public'));

const swaggerDocument = JSON.parse(
  fs.readFileSync(`${__dirname}/src/swagger.json`, 'utf8')
);

mongoose.set('useCreateIndex', true);

// create a socket
const server = http.Server(app);
const io = socketio(server);
io.use(
  socketioJwt.authorize({
    secret: process.env.SECRET,
    handshake: true,
    callback: false
  })
);

// add swagger doc route
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  })
  .catch(e => {
    console.error(`error to trying connected to mongodb ${e}`);
  });

require('./src/routes')(app);
require('./src/io')(io);
