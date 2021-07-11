const jwt = require('jsonwebtoken');
const getSecretString = require('../common/secret-string');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, getSecretString());
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Authentication failed.',
      data: error
    });
  }
};