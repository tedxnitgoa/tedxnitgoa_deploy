require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const Payment = require('./models/payment.js');
const ContactForm = require('./models/ContactForm.js');
const { generateTicketPDF } = require('./pdfutils.js');
const path = require('path');
const {connectCloudinary} = require("./cloudinary/config.js");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
const allowedOrigins = process.env.FRONTEND_URL.split(",");
if (!allowedOrigins) {
  allowedOrigins = "http://localhost:3000"
}
app.use(cors({
  rigin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
    } else {
        callback(new Error("Not allowed by CORS"));
    }
},
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));
app.use(express.json());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api', limiter);

// Connect to MongoDB
const connectDb = async()=>{
  try {
      const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tedx_database"
      const mongoConnection = await mongoose.connect(MONGODB_URI);
      console.log("Connected to MongoDB :",mongoConnection.connection.host);
  } catch (error) {
      console.log("Error connecting to MongoDB:",error);
  }
}
connectCloudinary();
connectDb()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERR: ",error);
        throw error
    })
    app.listen(process.env.PORT||3000,()=>{
        console.log(`Server running on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MongoDB connection error !!! ",err);
})

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
  body('quantity').isInt({ min: 1, max: 30 })
];

// Routes
app.get("/api/health",(req,res)=>{
  res.status(200).json({"status":"running"});
})
app.get('/api/available-tickets', async (req, res) => {
  try {
    const totalTicketsSold = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);

    const availableTickets = 30 - (totalTicketsSold[0]?.total || 0);
    res.json({ availableTickets });
  } catch (error) {
    console.error('Error fetching available tickets:', error);
    res.status(500).json({ message: 'Error fetching available tickets' });
  }
});

app.post('/api/create-order', validateOrderInput, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { name, email, phone, ticketType, quantity } = req.body;

  try {
    const ticketPrices = {
      general: 765,
      vip: 918,
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

app.post('/api/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      const { amount, ticketType, quantity, name, email, phone } = req.body;
      const payment = new Payment({
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
      await payment.save();

      const pdfFilePath = await generateTicketPDF({
        name, email, phone, ticketType, quantity, orderId: razorpay_order_id, paymentId: razorpay_payment_id
      });


      res.json({ success: true, message: 'Payment successful', pdfFilePath });
    } catch (error) {
      console.error('Error processing payment or generating PDF:', error);
      res.status(500).json({ success: false, message: 'Error processing payment', error: error.message });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
});

app.post('/api/payment-webhook', async (req, res) => {
  try {
    const { event, payload } = req.body;

    // Only process 'payment.captured' events
    if (event === 'payment.captured') {
      const { id: razorpay_payment_id, order_id: razorpay_order_id, status, amount } = payload.payment.entity;

      // Update the payment status to 'success' based on the webhook data
      const payment = await Payment.findOne({ orderId: razorpay_order_id });

      if (payment) {
        payment.status = status;  // Status should be 'captured' for successful payments
        payment.paymentId = razorpay_payment_id; // Save the paymentId for future references
        payment.amount = amount;  // Ensure the amount matches what was charged

        await payment.save();
        console.log(`Payment ${razorpay_payment_id} for order ${razorpay_order_id} captured successfully.`);
      } else {
        console.error(`Payment with orderId ${razorpay_order_id} not found.`);
      }

      // Respond with success status
      res.status(200).json({ success: true });
    } else {
      // If it's not the event we're interested in, just return a 400 status
      res.status(400).json({ success: false, message: 'Unsupported event' });
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// Route to serve PDF files
app.get('/api/download-ticket/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'tickets', filename);
  res.download(filePath, (err) => {
    if (err) {
      res.status(404).json({ message: 'Ticket not found' });
    }
  });
});

// New route for contact form submission
app.post('/api/submit-form', [
  body('firstName').trim().isLength({ min: 2, max: 100 }).escape(),
  body('lastName').trim().optional().isLength({ max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('contactNumber').isMobilePhone(),
  body('comments').trim().optional().isLength({ max: 1000 }).escape(),
  body('newsletter').isBoolean()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newContactForm = new ContactForm(req.body);
    await newContactForm.save();
    console.log('Form submitted:', newContactForm);
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'Error submitting form' });
  }
});


