const express = require('express');
const { body, validationResult } = require('express-validator');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('./models/payment.js');
const { generateTicketPDF } = require('./index.js'); // Import the function
const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Validation middleware
const validateOrderInput = [
  body('name').trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone(),
  body('ticketType').isIn(['general', 'vip', 'student']),
  body('quantity').isInt({ min: 1, max: 100 })
];

router.post('/create-order', validateOrderInput, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { name, email, phone, ticketType, quantity } = req.body;

  try {
    const ticketPrices = {
      general: 1,
      vip: 2000,
      student: 500
    };
    const amount = ticketPrices[ticketType] * quantity;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { name, email, phone, ticketType, quantity }
    });

    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, razorpayKeyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");

    if (expectedSignature === razorpay_signature) {
      const { amount, ticketType, quantity, name, email, phone } = req.body;
      const payment = await Payment.create({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount,
        status: 'success',
        ticketType,
        quantity,
        name,
        email,
        phone
      });

      if(!payment) {
        return res.status(500).json({ success: false, message: 'Error saving payment'})
      }

      const pdfFilePath = await generateTicketPDF({
        name, email, phone, ticketType, quantity, orderId: razorpay_order_id, paymentId: razorpay_payment_id
      });

      res.json({ success: true, message: 'Payment successful', pdfFilePath });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
