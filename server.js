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

// Middleware для проверки токена
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === process.env.ADMIN_TOKEN) {
    next();
  } else {
    res.status(403).json({ error: 'Доступ запрещён' });
  }
};

// Маршруты API
app.use('/api', require('./routes/api')(authMiddleware));

// Настройка Telegram-бота с вебхуком
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);
const webhookPath = `/bot${process.env.TELEGRAM_TOKEN}`;
const webhookUrl = `https://ikhvbot-server.onrender.com${webhookPath}`;

// Установка вебхука
bot.setWebHook(webhookUrl).then(() => {
  console.log(`Вебхук установлен: ${webhookUrl}`);
}).catch(err => {
  console.error('Ошибка установки вебхука:', err);
});

// Обработка входящих обновлений
app.post(webhookPath, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Обработка команды /start
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

// Маршрут для проверки статуса
app.get('/webhook-status', (req, res) => {
  bot.getWebHookInfo().then(info => res.json(info));
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));