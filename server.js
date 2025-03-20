const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://ikhvbot.netlify.app',
}));

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB подключён'))
  .catch(err => console.error('Ошибка MongoDB:', err));

// Модели
const News = require('./models/News');
const Place = require('./models/Place');

// Маршруты
app.use('/api', require('./routes/api'));

// Настройка Telegram-бота
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Добро пожаловать в iKHVbot!', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Открыть портал', web_app: { url: 'https://ikhvbot.netlify.app' } }]
      ]
    }
  });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));