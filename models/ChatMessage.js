const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  channel: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
