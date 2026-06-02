const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const { protect } = require('../middleware/auth');

// CREATE DONATION (DONOR ONLY)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({
        message: 'Only donors can create donations'
      });
    }

    const {
      title,
      description,
      quantity,
      expiryTime,
      pickupAddress,
      coordinates,
      foodType
    } = req.body;

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

    res.status(201).json({
      message: 'Donation created successfully',
      donation
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// GET DONATIONS BASED ON ROLE
router.get('/', protect, async (req, res) => {
  try {

    let query = {};

    // NGO sees only available donations
    if (req.user.role === 'ngo') {
      query = {
        status: 'available'
      };
    }

    // Volunteer sees requested, pickedup and delivered donations
    else if (req.user.role === 'volunteer') {
      query = {
        status: {
          $in: [
            'requested',
            'pickedup',
            'delivered'
          ]
        }
      };
    }

    // Donor/Admin sees all
    else {
      query = {};
    }

    const donations = await Donation.find(query)
      .populate('donorId', 'name email phone address')
      .populate('requestedBy', 'name email')
      .populate('assignedVolunteer', 'name email')
      .sort({ createdAt: -1 });

    res.json(donations);

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// GET DONOR'S OWN DONATIONS
router.get('/my/donations', protect, async (req, res) => {
  try {

    if (req.user.role !== 'donor') {
      return res.status(403).json({
        message: 'Only donors can view their donations'
      });
    }

    const donations = await Donation.find({
      donorId: req.user._id
    }).sort({ createdAt: -1 });

    res.json(donations);

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// GET SINGLE DONATION
router.get('/:id', protect, async (req, res) => {
  try {

    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name email phone address')
      .populate('requestedBy', 'name email')
      .populate('assignedVolunteer', 'name email');

    if (!donation) {
      return res.status(404).json({
        message: 'Donation not found'
      });
    }

    res.json(donation);

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// NGO REQUEST DONATION
router.patch('/:id/request', protect, async (req, res) => {
  try {

    if (req.user.role !== 'ngo') {
      return res.status(403).json({
        message: 'Only NGOs can request donations'
      });
    }

    const donation = await Donation.findOneAndUpdate(
      {
        _id: req.params.id,
        status: 'available'
      },
      {
        status: 'requested',
        requestedBy: req.user._id
      },
      {
        new: true
      }
    );

    if (!donation) {
      return res.status(400).json({
        message: 'Donation not available'
      });
    }

    res.json({
      message: 'Donation requested successfully',
      donation
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// VOLUNTEER MARK PICKUP
router.patch('/:id/pickup', protect, async (req, res) => {
  try {

    if (req.user.role !== 'volunteer') {
      return res.status(403).json({
        message: 'Only volunteers can mark pickup'
      });
    }

    const donation = await Donation.findOneAndUpdate(
      {
        _id: req.params.id,
        status: 'requested'
      },
      {
        status: 'pickedup',
        assignedVolunteer: req.user._id
      },
      {
        new: true
      }
    );

    if (!donation) {
      return res.status(400).json({
        message: 'Donation cannot be picked up'
      });
    }

    res.json({
      message: 'Donation marked as picked up',
      donation
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// VOLUNTEER MARK DELIVERED
router.patch('/:id/deliver', protect, async (req, res) => {
  try {

    if (req.user.role !== 'volunteer') {
      return res.status(403).json({
        message: 'Only volunteers can mark delivery'
      });
    }

    const donation = await Donation.findOneAndUpdate(
      {
        _id: req.params.id,
        status: 'pickedup'
      },
      {
        status: 'delivered'
      },
      {
        new: true
      }
    );

    if (!donation) {
      return res.status(400).json({
        message: 'Donation cannot be delivered'
      });
    }

    res.json({
      message: 'Donation delivered successfully',
      donation
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;