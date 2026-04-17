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
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    const dayOfWeek = parsedDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });

    let travelOptions = [];
    if (mode === 'all') {
      // In "all" mode, fetch both train and bus day-wise plans.
      const [busOptions, trainOptions] = await Promise.all([
        TravelOption.find({
          dayOfWeek: dayOfWeek,
          fromLocation: fromLocation,
          toLocation: toLocation,
          mode: 'bus',
          departureTime: { $gt: time },
        }).sort({ departureTime: 1 }).limit(3),
        TravelOption.find({
          dayOfWeek: dayOfWeek,
          fromLocation: fromLocation,
          toLocation: toLocation,
          mode: 'train',
          departureTime: { $gt: time },
        }).sort({ departureTime: 1 }).limit(3),
      ]);

      travelOptions = [...busOptions, ...trainOptions]
        .sort((a, b) => a.departureTime.localeCompare(b.departureTime))
        .slice(0, 6);
    } else {
      travelOptions = await TravelOption.find({
        dayOfWeek: dayOfWeek,
        fromLocation: fromLocation,
        toLocation: toLocation,
        mode: mode,
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
