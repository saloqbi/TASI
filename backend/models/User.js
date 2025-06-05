const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  subscriptionActive: { type: Boolean, default: false },
  firebaseToken: String,
  language: { type: String, default: 'ar' }
});
module.exports = mongoose.model('User', UserSchema);