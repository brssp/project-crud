const express = require('express');

const emojis = require('./emojis');
const pjs = require('./pjs');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/emojis', emojis);
router.use('/projects', pjs);

module.exports = router;
