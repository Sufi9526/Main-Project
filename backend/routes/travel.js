import express from 'express';
import TravelOption from '../models/TravelOption.js';

const router = express.Router();

// Search travel options
router.post('/search', async (req, res) => {
  try {
    const { date, time, fromLocation, toLocation, mode } = req.body;

    // Validate input
    if (!date || !time || !fromLocation || !toLocation || !mode) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find travel options that match criteria and departure time is after entered time
    const travelOptions = await TravelOption.find({
      date: date,
      fromLocation: fromLocation,
      toLocation: toLocation,
      mode: mode,
      departureTime: { $gt: time }, // Only show options after entered time
    })
      .sort({ departureTime: 1 }) // Sort by departure time
      .limit(3); // Return only 3 options

    res.json(travelOptions);
  } catch (error) {
    console.error('Error searching travel options:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get specific travel option by ID
router.get('/:id', async (req, res) => {
  try {
    const travelOption = await TravelOption.findById(req.params.id);

    if (!travelOption) {
      return res.status(404).json({ message: 'Travel option not found' });
    }

    res.json(travelOption);
  } catch (error) {
    console.error('Error fetching travel option:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
