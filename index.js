const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const http = require('http');

require('dotenv').config();

process.env.TZ = 'America/Guayaquil'; // zona horaria de la app

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// public files
app.use(express.static('public'));

const swaggerDocument = JSON.parse(
  fs.readFileSync(`${__dirname}/src/swagger.json`, 'utf8')
);

mongoose.set('useCreateIndex', true);

require('./src/routes')(app);

// add swagger doc route
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT ? process.env.PORT : 3000;
app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
  mongoose
    .connect(process.env.MONGO, {
      useNewUrlParser: true
    })
    .then(() => {
      setInterval(() => {
        http.get('https://backend-curso-flutter.herokuapp.com');
      }, 600000); // every 10 minutes (600000)
    })
    .catch(e => {
      console.error(`error to trying connected to mongodb ${e}`);
    });
});
