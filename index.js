const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

require('dotenv').config();

process.env.TZ = 'America/Guayaquil'; // zona horaria de la app

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// public files
app.use(express.static("public"));


const swaggerDocument = JSON.parse(
  fs.readFileSync(`${__dirname}/src/swagger.json`, 'utf8')
);

mongoose.set('useCreateIndex', true);

require('./src/routes')(app);

// add swagger doc route
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT, () => {
  console.log(`running on ${process.env.PORT}`);
  mongoose
    .connect(process.env.MONGO, {
      useNewUrlParser: true
    })
    .then(() => {
      console.log(`connected to mongodb`);
    })
    .catch(e => {
      console.error(`error to trying connected to mongodb ${e}`);
    });
});
