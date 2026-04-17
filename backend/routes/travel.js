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

    const parsedDate = new Date(date);
    const dayOfWeek = !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })
      : null;

    const modeFilter = mode === 'all' ? { $in: ['bus', 'train'] } : mode;

    // Always prefer weekday-specific schedules so each day can have different plans.
    let travelOptions = [];
    if (dayOfWeek) {
      travelOptions = await TravelOption.find({
        dayOfWeek: dayOfWeek,
        fromLocation: fromLocation,
        toLocation: toLocation,
        mode: modeFilter,
        departureTime: { $gt: time },
      })
        .sort({ departureTime: 1 })
        .limit(3);
    }

    // Fallback for legacy seeded records that only have an exact date.
    if (travelOptions.length === 0) {
      travelOptions = await TravelOption.find({
        date: date,
        fromLocation: fromLocation,
        toLocation: toLocation,
        mode: modeFilter,
        departureTime: { $gt: time },
      })
        .sort({ departureTime: 1 })
        .limit(3);
    }

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
