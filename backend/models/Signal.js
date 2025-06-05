const mongoose = require('mongoose');
const SignalSchema = new mongoose.Schema({
  pair: String,
  direction: String, // Buy/Sell
  entry: Number,
  stopLoss: Number,
  takeProfit: Number,
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Signal', SignalSchema);