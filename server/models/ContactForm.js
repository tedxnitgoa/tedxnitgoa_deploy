const mongoose = require('mongoose');

const contactFormSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  comments: { type: String },
  newsletter: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactForm', contactFormSchema);