const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET platform statistics
router.get('/', protect, async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments();
    const deliveredDonations = await Donation.countDocuments({ status: 'delivered' });
    const availableDonations = await Donation.countDocuments({ status: 'available' });
    const requestedDonations = await Donation.countDocuments({ status: 'requested' });
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalNGOs = await User.countDocuments({ role: 'ngo' });
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });

    return res.json({
      totalDonations,
      deliveredDonations,
      availableDonations,
      requestedDonations,
      totalDonors,
      totalNGOs,
      totalVolunteers,
      mealsDistributed: deliveredDonations
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;