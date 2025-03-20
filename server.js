const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://ikhvbot.netlify.app', // Позже заменим на URL Netlify
}));

// Подключение к MongoDB без устаревших опций
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB подключён'))
  .catch(err => console.error('Ошибка MongoDB:', err));

// Модели
const News = require('./models/News');
const Place = require('./models/Place');


// Маршруты
app.use('/api', require('./routes/api'));

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
