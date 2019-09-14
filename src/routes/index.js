const jsonwebtoken = require('jsonwebtoken');
const _ = require('lodash');
const auth = require('../controllers/auth');
const profile = require('../controllers/profile');
const tokens = require('../controllers/tokens');
const isLogin = require('../middlewares/isLogin');
const uploader = require('../middlewares/uploader');

const EXPIRES_IN = 60 * 60; // 1 hour

module.exports = app => {
  app.get('/', (req, res) => {
    res.render('index');
  });

  app.post('/api/v1/register', async (req, res) => {
    try {
      const response = await auth.register(req.body);
      const token = await jsonwebtoken.sign(
        { id: response._id },
        process.env.SECRET,
        {
          expiresIn: EXPIRES_IN
        }
      );
      res.status(200).send({
        token,
        expiresIn: EXPIRES_IN
      });
    } catch (error) {
      if (error.code && error.code === 11000) {
        res.status(500).send({ message: 'Error email duplicado' });
        return;
      }
      res.status(500).send({ message: error.message });
    }
  });

  app.post('/api/v1/login', async (req, res) => {
    try {
     
      const response = await auth.login(req.body);
      const token = await jsonwebtoken.sign(
        { id: response._id },
        process.env.SECRET,
        {
          expiresIn: EXPIRES_IN
        }
      );
      res.status(200).send({
        token,
        expiresIn: EXPIRES_IN
      });
    } catch (error) {
      console.log("login error",error.message);
      res.status(500).send({ message: error.message });
    }
  });

  app.get('/api/v1/user-info', isLogin, async (req, res) => {
    try {
      const response = await profile.info(req.userId);
      res.status(200).send(response);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

  app.post(
    '/api/v1/update-avatar',
    isLogin,
    uploader.single('attachment'),
    async (req, res) => {
      try {
        const { file } = req;
        if (!file) {
          throw new Error('Please upload a file');
        }
        await profile.avatar(req.userId, req.filePath);
        res.status(200).send(req.filePath);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    }
  );

  // create a new refreshToken for an especific user by Id
  app.post('/api/v1/tokens/register', isLogin, async (req, res) => {
    try {
      const { token } = req.headers;
      const data = await jsonwebtoken.verify(token, process.env.SECRET);
      const payload = _.omit(data, ['iat', 'exp']);
      // console.log('data', payload);
      await tokens.newRefreshToken(token, payload);
      res.status(200).send({ message: 'OK' });
    } catch (error) {
      console.log('/api/v1/tokens/register', error.message);
      res.status(500).send({ message: error.message });
    }
  });

  // create a new jwt token for an especific user by Id
  app.post('/api/v1/tokens/refresh', async (req, res) => {
    try {
      const { token } = req.headers;
      const data = await tokens.refresh(token);
      if (!data) throw new Error('invalid refreshToken');
      console.log('token refrescado');
      res.status(200).send(data);
    } catch (error) {
      console.log('error refresh-token', error.message);
      if (error.message === '403') {
        res.status(403).send({ message: error.message });
      } else {
        res.status(500).send({ message: error.message });
      }
    }
  });
};
