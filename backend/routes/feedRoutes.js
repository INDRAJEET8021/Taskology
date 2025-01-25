const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { storage } = require('../config/cloudinaryConfig');
const Feed = require('../models/Feed');
const authenticate = require('../middleware/authenticate'); // Custom middleware for authentication

const router = express.Router();
const upload = multer({ storage });

// Upload feed image
router.post(
  '/add-feed',
  authenticate, 
  upload.single('image'),
  body('caption').optional().isString().isLength({ max: 200 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { caption } = req.body;
      const imageUrl = req.file.path; // Cloudinary URL

      const newFeed = new Feed({
        user: req.user.id, // Extracted from authenticate middleware
        imageUrl,
        caption,
      });

      await newFeed.save();

      res.status(201).json({ message: 'Feed added successfully', feed: newFeed });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error, try again later' });
    }
  }
);

// Route to get feeds with related user details
router.get('/all', async (req, res) => {
  try {
    const feeds = await Feed.find().populate('user', 'username email'); // Populate related user details
    res.status(200).json({ feeds });
  } catch (error) {
    console.error('Error fetching feeds:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
