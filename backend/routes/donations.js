const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const {
  sendNewDonationToNGOs,
  sendClaimedEmail,
  sendPickupRequestToVolunteers,
  sendPickupEmail,
  sendDeliveredEmail
} = require('../utils/emailService');

// ─────────────────────────────────────────────
// CREATE DONATION (DONOR ONLY)
// Triggers: email to ALL NGOs → "New food available!"
// ─────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ message: 'Only donors can create donations' });
    }

    const { title, description, quantity, expiryTime, pickupAddress, coordinates, foodType } = req.body;

    const donation = new Donation({
      title,
      description,
      quantity,
      expiryTime,
      pickupAddress,
      coordinates,
      foodType,
      donorId: req.user._id
    });

    await donation.save();

    // 📧 Notify all active NGOs about the new donation
    const ngos = await User.find({ role: 'ngo', isActive: true }, 'email');
    const ngoEmails = ngos.map(n => n.email).filter(Boolean);

    if (ngoEmails.length > 0) {
      await sendNewDonationToNGOs(ngoEmails, title, req.user.name, pickupAddress, quantity);
    }

    res.status(201).json({ message: 'Donation created successfully', donation });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────
// GET DONATIONS BASED ON ROLE
// ─────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'ngo') {
      query = { status: 'available' };
    } else if (req.user.role === 'volunteer') {
      query = { status: { $in: ['requested', 'pickedup', 'delivered'] } };
    } else {
      query = {};
    }

    const donations = await Donation.find(query)
      .populate('donorId', 'name email phone address')
      .populate('requestedBy', 'name email')
      .populate('assignedVolunteer', 'name email')
      .sort({ createdAt: -1 });

    res.json(donations);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────
// GET DONOR'S OWN DONATIONS
// ─────────────────────────────────────────────
router.get('/my/donations', protect, async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ message: 'Only donors can view their donations' });
    }

    const donations = await Donation.find({ donorId: req.user._id }).sort({ createdAt: -1 });
    res.json(donations);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────
// GET SINGLE DONATION
// ─────────────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name email phone address')
      .populate('requestedBy', 'name email')
      .populate('assignedVolunteer', 'name email');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json(donation);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────
// NGO CLAIMS DONATION
// Triggers:
//   → Email DONOR: "Your food was claimed by [NGO]"
//   → Email ALL VOLUNTEERS: "Pickup needed!"
// ─────────────────────────────────────────────
router.patch('/:id/request', protect, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can request donations' });
    }

    const donation = await Donation.findOneAndUpdate(
      { _id: req.params.id, status: 'available' },
      { status: 'requested', requestedBy: req.user._id },
      { new: true }
    ).populate('donorId', 'name email');

    if (!donation) {
      return res.status(400).json({ message: 'Donation not available' });
    }

    // 📧 Notify donor their food was claimed
    if (donation.donorId?.email) {
      await sendClaimedEmail(
        donation.donorId.email,
        donation.donorId.name,
        donation.title,
        req.user.name
      );
    }

    // 📧 Notify all active volunteers a pickup is needed
    const volunteers = await User.find({ role: 'volunteer', isActive: true }, 'email');
    const volunteerEmails = volunteers.map(v => v.email).filter(Boolean);

    if (volunteerEmails.length > 0) {
      await sendPickupRequestToVolunteers(
        volunteerEmails,
        donation.title,
        req.user.name,
        donation.pickupAddress
      );
    }

    res.json({ message: 'Donation requested successfully', donation });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────
// VOLUNTEER MARKS PICKUP
// Triggers: Email NGO → "Volunteer [name] is on the way"
// ─────────────────────────────────────────────
router.patch('/:id/pickup', protect, async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Only volunteers can mark pickup' });
    }

    const donation = await Donation.findOneAndUpdate(
      { _id: req.params.id, status: 'requested' },
      { status: 'pickedup', assignedVolunteer: req.user._id },
      { new: true }
    ).populate('requestedBy', 'name email');

    if (!donation) {
      return res.status(400).json({ message: 'Donation cannot be picked up' });
    }

    // 📧 Notify NGO that volunteer is coming
    if (donation.requestedBy?.email) {
      await sendPickupEmail(
        donation.requestedBy.email,
        donation.requestedBy.name,
        donation.title,
        req.user.name
      );
    }

    res.json({ message: 'Donation marked as picked up', donation });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────
// VOLUNTEER MARKS DELIVERED
// Triggers: Email DONOR → "Your food reached [NGO]"
// ─────────────────────────────────────────────
router.patch('/:id/deliver', protect, async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Only volunteers can mark delivery' });
    }

    const donation = await Donation.findOneAndUpdate(
      { _id: req.params.id, status: 'pickedup' },
      { status: 'delivered' },
      { new: true }
    )
      .populate('donorId', 'name email')
      .populate('requestedBy', 'name email');

    if (!donation) {
      return res.status(400).json({ message: 'Donation cannot be delivered' });
    }

    // 📧 Notify donor their food was successfully delivered
    if (donation.donorId?.email) {
      await sendDeliveredEmail(
        donation.donorId.email,
        donation.donorId.name,
        donation.title,
        donation.requestedBy?.name
      );
    }

    res.json({ message: 'Donation delivered successfully', donation });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;