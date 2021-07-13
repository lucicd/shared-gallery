const jwt = require('jsonwebtoken');
const getSecretString = require('../common/secret-string');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, getSecretString());
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    };
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Authentication failed.',
      data: error
    });
  }
};