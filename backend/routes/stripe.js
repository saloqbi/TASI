const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const stripeController = require('../controllers/stripeController');

router.post('/create-checkout-session', auth, stripeController.createCheckoutSession);
router.post('/webhook', express.raw({type: 'application/json'}), stripeController.webhook);

module.exports = router;