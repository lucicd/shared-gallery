const express = require('express');
const sequenceGenerator = require('./sequenceGenerator');
const Image = require('../models/image');
const User = require('../models/user');

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
            image.owner = image.owner.id;
            image.ownerName = image.owner.name;
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
      .then(owner => resolve(owner))
      .catch(() => reject('Owner not found'));
  });
}

router.post('/', (req, res, next) => {
  getOwner(req.body.ownerId)
    .then(
      owner => {
        const maxImageId = sequenceGenerator.nextId('images');
        const image = new Image({
          id: maxImageId,
          description: req.body.description,
          url: req.body.url,
          owner: owner._id
        });
        image.save()
          .then(savedImage => {
            res.status(201).json({
              message: 'Image added successfully',
              data: savedImage
            });
          })
          .catch(error => {
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