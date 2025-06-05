const Signal = require('../models/Signal');

exports.getSignals = async (req, res) => {
  const signals = await Signal.find().sort({ date: -1 });
  res.json(signals);
};

exports.createSignal = async (req, res) => {
  const signal = new Signal(req.body);
  await signal.save();
  res.status(201).json(signal);
};