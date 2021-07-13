const express = require('express');
const sequenceGenerator = require('./sequenceGenerator');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const getSecretString = require('../common/secret-string');

const router = express.Router();

router.post('/signup', 
  (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const maxUserId = sequenceGenerator.nextId('users');
        const user = new User({
          id: maxUserId,
          name: req.body.name,
          email: req.body.email,
          password: hash
        });
        console.log(user);
        user.save()
          .then(createdUser => {
            res.status(201).json({
              message: 'Thank you for signing up!',
              data: {
                id: createdUser.id,
                name: createdUser.name,
                email: createdUser.email
              }
            });
          })
          .catch(error => res.status(500).json(error));
      });
});

router.post(
  '/login',
  (req, res, next) => {
    User.findOne( {email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ 
            message: 'Authentication failed.' 
          });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(result => {
            if (!result) {
              return res.status(401).json({
                message: 'Authenitcation failed.',
              });
            }
            const token = jwt.sign(
              { email: user.email, userId: user._id },
              getSecretString() 
            );
            res.status(200).json({
              message: 'Authentication successful.',
              data: {
                id: user.id,
                email: user.email,
                name: user.name,
                token: token
              }
            });
          })
          .catch(error => {
            return res.status(401).json({
              message: 'Authenitcation failed.',
            });
          });
      })
});
  
module.exports = router; 