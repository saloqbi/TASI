const mongoose = require('mongoose');
const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stripeSubscriptionId: String,
  active: { type: Boolean, default: false },
  startedAt: Date,
  endedAt: Date
});
module.exports = mongoose.model('Subscription', SubscriptionSchema);