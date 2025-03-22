const express = require('express');

module.exports = (authMiddleware) => {
  const router = express.Router();
  const News = require('../models/News');
  const Place = require('../models/Place');

  // Получение новостей (без авторизации)
  router.get('/news', async (req, res) => {
    try {
      const news = await News.find().sort({ date: -1 }).limit(10);
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  });

  // Добавление новости (с авторизацией)
  router.post('/news', authMiddleware, async (req, res) => {
    try {
      const news = new News(req.body);
      await news.save();
      res.status(201).json(news);
    } catch (error) {
      res.status(400).json({ error: 'Ошибка добавления' });
    }
  });

  // Редактирование новости (с авторизацией)
  router.put('/news/:id', authMiddleware, async (req, res) => {
    try {
      const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!news) return res.status(404).json({ error: 'Новость не найдена' });
      res.json(news);
    } catch (error) {
      res.status(400).json({ error: 'Ошибка редактирования' });
    }
  });

  // Удаление новости (с авторизацией)
  router.delete('/news/:id', authMiddleware, async (req, res) => {
    try {
      const news = await News.findByIdAndDelete(req.params.id);
      if (!news) return res.status(404).json({ error: 'Новость не найдена' });
      res.json({ message: 'Новость удалена' });
    } catch (error) {
      res.status(400).json({ error: 'Ошибка удаления' });
    }
  });

  // Получение мест (без авторизации)
  router.get('/places', async (req, res) => {
    try {
      const places = await Place.find();
      res.json(places);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  });

  // Добавление места (с авторизацией)
  router.post('/places', authMiddleware, async (req, res) => {
    try {
      const place = new Place(req.body);
      await place.save();
      res.status(201).json(place);
    } catch (error) {
      res.status(400).json({ error: 'Ошибка добавления' });
    }
  });

  // Редактирование места (с авторизацией)
  router.put('/places/:id', authMiddleware, async (req, res) => {
    try {
      const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!place) return res.status(404).json({ error: 'Место не найдено' });
      res.json(place);
    } catch (error) {
      res.status(400).json({ error: 'Ошибка редактирования' });
    }
  });

  // Удаление места (с авторизацией)
  router.delete('/places/:id', authMiddleware, async (req, res) => {
    try {
      const place = await Place.findByIdAndDelete(req.params.id);
      if (!place) return res.status(404).json({ error: 'Место не найдено' });
      res.json({ message: 'Место удалено' });
    } catch (error) {
      res.status(400).json({ error: 'Ошибка удаления' });
    }
  });

  return router;
};