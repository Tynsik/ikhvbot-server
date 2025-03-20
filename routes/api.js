const express = require('express');
const router = express.Router();
const News = require('../models/News');
const Place = require('../models/Place');

router.get('/news', async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 }).limit(10);
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/places', async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
