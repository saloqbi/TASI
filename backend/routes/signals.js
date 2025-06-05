const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const signalsController = require('../controllers/signalsController');

router.get('/', auth, signalsController.getSignals);
router.post('/', auth, signalsController.createSignal);

module.exports = router;