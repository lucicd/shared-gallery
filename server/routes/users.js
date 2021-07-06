const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(createdUser => {
          res.status(201).json({
            message: 'User created.',
            data: createdUser
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred.',
            data: error
          });
        });
    });
  });

  router.post('/login', (req, res, next) => {
    User.findOne( {email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({
            message: 'Authentication failed.',
            data: {}
          });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(result => {
            if (!result) {
              return res.status(401).json({
                message: 'Authenitcation failed.',
                data: {}
              });
            }
            const token = jwt.sign(
              { email: user.email, userId: user._id },
              'this-is-just-for-development', 
              { expiresIn: '1h' }
            );
            res.status(200).json({
              message: 'Authentication successful.',
              data: token
            });
          })
          .catch(error => {
            return res.status(401).json({
              message: 'Authenitcation failed.',
              data: {}
            });
          });
      })
    });
  
module.exports = router; 