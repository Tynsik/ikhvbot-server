const mongoose = require('mongoose');
const newsSchema = new mongoose.Schema({
  title: String,
  description: String,
  source: String,
  image: String,
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('News', newsSchema);
