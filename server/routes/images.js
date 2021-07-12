const express = require('express');
const multer = require('multer');
const sequenceGenerator = require('./sequenceGenerator');
const Image = require('../models/image');
const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIMIE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIMIE_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    callback(error, 'server/images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIMIE_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + extension);
  }
});

function getOwner(ownerId) {
  return new Promise((resolve, reject) => {
    if (!ownerId) {
      reject('Owner ID is empty.');
      return;
    }
    User.findOne({ id: ownerId })
      .then(owner => resolve(owner))
      .catch(error => reject(error));
  });
}

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

router.get('/for-owner/:owner_id', (req, res, next) => {
  getOwner(req.params.owner_id)
    .then(
      owner => {
        if (!owner) {
          return res.status(404).json('Owner not found.');
        }
        Image.find({ owner: owner._id })
          .populate('owner')
          .lean()
          .then(images => {
            const data = images.map(image => {
              return {
                id: image.id,
                title: image.title,
                description: image.description,
                url: image.url
              }
            });
            res.status(200).json(data);
          })
          .catch(error => {
            res.status(500).json(error);
          });
      }
    );
});

router.post(
  '/',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
  getOwner(req.body.owner_id)
    .then(
      owner => {
        const maxImageId = sequenceGenerator.nextId('images');
        const url = req.protocol + '://' + req.get('host');
        const image = new Image({
          id: maxImageId,
          title: req.body.title,
          description: req.body.description,
          url: url + '/images/' + req.file.filename,
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

router.put(
  '/:id',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    Image.findOne({ id: req.params.id })
      .then(image => {
        if (!image) {
          return res.status(404).json('Image not found.');
        }
        image.name = req.body.name,
        image.title = req.body.title,
        image.description = req.body.description;
        if (req.file) {
          const url = req.protocol + '://' + req.get('host');
          image.url = url + '/images/' + req.file.filename;
        } 
        Image.updateOne({ id: req.params.id }, image)
          .then(() => res.status(200).json({ url: image.url}))
          .catch(error => res.status(500).json(error))
      })
      .catch(error => res.status(500).json(error));
    });

router.delete(
  '/:id',
  checkAuth,
  (req, res, next) => {
  Image.findOne({ id: req.params.id })
    .then(image => {
      Image.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: 'Image deleted successfully'
          });
        })
        .catch(error => {
            res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        })
    })
    .catch(error => {
      res.status(500).json({
        message: 'Image not found.',
        error: { document: 'Image not found'}
      });
    });
});

module.exports = router; 