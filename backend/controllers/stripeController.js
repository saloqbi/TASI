const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);
const User = require('../models/User');
const Subscription = require('../models/Subscription');

exports.createCheckoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: process.env.FRONTEND_URL + '/success',
      cancel_url: process.env.FRONTEND_URL + '/cancel',
      customer_email: req.body.email,
      metadata: { userId: req.user.id },
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    await User.findByIdAndUpdate(userId, { subscriptionActive: true });
    await Subscription.create({
      userId,
      stripeSubscriptionId: session.subscription,
      active: true,
      startedAt: new Date(),
    });
  }
  res.json({ received: true });
};