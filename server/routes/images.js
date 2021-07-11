const express = require('express');
const sequenceGenerator = require('./sequenceGenerator');
const Image = require('../models/image');
const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/', (req, res, next) => {
  Image.find()
    .populate('owner')
    .lean()
    .then(images => {
      res.status(200).json({
        message: 'Images retrieved successfuly',
        data: images.map(
          image => {
            delete image._id;
            image.ownerName = image.owner.name;
            image.owner = image.owner.id;
            return image;
          }
        )
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occured',
        data: error
      });
    });
});

function getOwner(ownerId) {
  return new Promise((resolve, reject) => {
    if (!ownerId) {
      reject('Owner ID is empty.');
      return;
    }
    User.findOne({ id: ownerId })
      .then(owner => {
        // console.log(owner);
        resolve(owner);
      })
      .catch(() => reject('Owner not found'));
  });
}

router.post(
  '/',
  checkAuth,
  (req, res, next) => {
  // console.log(req);
  getOwner(req.body.owner_id)
    .then(
      owner => {
        // console.log(owner);
        const maxImageId = sequenceGenerator.nextId('images');
        const image = new Image({
          id: maxImageId,
          title: req.body.title,
          description: req.body.description,
          url: req.body.url,
          owner: owner._id
        });
        // console.log(req.body.title);
        // console.log(image);
        image.save()
          .then(savedImage => {
            res.status(201).json({
              message: 'Image added successfully',
              data: savedImage
            });
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({
              message: 'An error occurred',
              data: error
            });
          });
      },
      error => {
        res.status(404).json({
          message: error,
          data: error
        });
      }
    );
});

module.exports = router; 