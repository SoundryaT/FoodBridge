const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  quantity: {
    type: String,
    required: true
  },
  expiryTime: {
    type: Date,
    required: true
  },
  pickupAddress: {
    type: String,
    required: true
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  status: {
    type: String,
    enum: ['available', 'requested', 'pickedup', 'delivered', 'expired'],
    default: 'available'
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  foodType: {
    type: String,
    enum: ['veg', 'nonveg', 'both'],
    default: 'veg'
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);