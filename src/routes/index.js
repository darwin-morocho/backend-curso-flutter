const jwt = require('jsonwebtoken');

const auth = require('../controllers/auth');
const profile = require('../controllers/profile');
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
      const token = await jwt.sign({ id: response._id }, process.env.SECRET, {
        expiresIn: EXPIRES_IN
      });
      res.status(200).send({
        token,
        expiresIn: EXPIRES_IN,
        user: response
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
      const token = await jwt.sign({ id: response._id }, process.env.SECRET, {
        expiresIn: EXPIRES_IN
      });
      res.status(200).send({
        token,
        expiresIn: EXPIRES_IN,
        user: response
      });
    } catch (error) {
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
};
