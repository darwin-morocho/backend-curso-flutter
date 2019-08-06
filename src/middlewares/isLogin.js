const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const result = await jwt.verify(token, process.env.SECRET);
    if (!result) {
      const error = new Error('invalid token');
      error.httpStatusCode = 403;
      return next(error);
    }
    req.userId = result.id;
    return next();
  } catch (error) {
    return res.status(403).send({ message: error.message });
  }
};
