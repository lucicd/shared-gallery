var express = require('express');
var router = express.Router();

module.exports = (path) => {
  router.get('/', (req, res, next) => res.sendFile(path));
  return router;
};
