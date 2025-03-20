const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*', // Позже заменим на URL Netlify
}));

// Подключение к MongoDB без устаревших опций
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB подключён'))
  .catch(err => console.error('Ошибка MongoDB:', err));

// Тестовые данные
const News = require('./models/News');
const Place = require('./models/Place');
const seedData = async () => {
  try {
    await News.deleteMany({});
    await Place.deleteMany({});
    await News.insertMany([
      { title: "Новый парк", description: "Открытие парка в центре.", source: "Новости", image: "https://via.placeholder.com/150" },
      { title: "Концерт", description: "Выступление в амфитеатре.", source: "Афиша", image: "https://via.placeholder.com/150" }
    ]);
    await Place.insertMany([
      { name: "Амурский утёс", category: "Достопримечательность", description: "Вид на реку.", location: { lat: 48.478, lng: 135.083 }, image: "https://via.placeholder.com/150" },
      { name: "Кафе Утёс", category: "Еда", description: "Уютное кафе.", location: { lat: 48.480, lng: 135.085 }, image: "https://via.placeholder.com/150" }
    ]);
    console.log('Тестовые данные добавлены');
  } catch (error) {
    console.error('Ошибка при добавлении данных:', error);
  }
};
seedData();

// Маршруты
app.use('/api', require('./routes/api'));

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
