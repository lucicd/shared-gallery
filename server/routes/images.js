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

router.get(
  '/private/', 
  checkAuth,
  (req, res, next) => {
    Image.find({ owner: req.userData.userId})
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

router.post(
  '/',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    const maxImageId = sequenceGenerator.nextId('images');
    const url = req.protocol + '://' + req.get('host');
    const image = new Image({
      id: maxImageId,
      title: req.body.title,
      description: req.body.description,
      url: url + '/images/' + req.file.filename,
      owner: req.userData.userId
    });
    image.save()
      .then(savedImage => {
        res.status(201).json({
          message: 'Image added successfully',
          data: {
            id: savedImage.id,
            title: savedImage.title,
            description: savedImage.description,
            url: savedImage.url
          }
        });
      })
      .catch(error => res.status(500).json(error));
});

router.put(
  '/:id',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    let image = {
      title: req.body.title,
      description: req.body.description,
      url: req.body.url,
    };
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      image.url = url + '/images/' + req.file.filename;
    } 
    Image.updateOne({ id: +req.params.id, owner: req.userData.userId }, image )
      .then(result => {
        if (result.nModified > 0) {
          res.status(201).json({ url: image.url, message: 'Image updated successfully' });
        } else if (result.n > 0) {
          res.status(200).json({ message: 'No changes required.' });
        } else {
          res.status(401).json({ message: 'Not authorized.'});
        }
      })
      .catch(error => {
        res.status(500).json(error);
      })
  }
);

router.delete(
  '/:id',
  checkAuth,
  (req, res, next) => {
    Image.deleteOne({ id: +req.params.id, owner: req.userData.userId })
      .then(result => {
        console.log(result);
        if (result.deletedCount > 0) {
          res.status(200).json({ message: 'Image deleted successfully' });
        } else {
          res.status(401).json({ message: 'Not authorized.'});
        }
      })
      .catch(error => {
          res.status(500).json(error);
      })
});

module.exports = router; 