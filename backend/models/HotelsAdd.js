// models/Hotels.js
const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,

  paymentDetails: {
    accountHolder: String,
    bankName: String,
    accountNumber: String,
    ifsc: String,
    upiId: String
  }
});

module.exports = mongoose.model('Hotels', HotelSchema);
