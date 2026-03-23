import express from 'express';
import TouristPlace from '../models/TouristPlace.js';

const router = express.Router();

// Get tourist places by location
router.get('/:location', async (req, res) => {
  try {
    const { location } = req.params;

    const touristPlaces = await TouristPlace.find({
      location: { $regex: new RegExp(location, 'i') }, // Case-insensitive search
    }).sort({ popularity: -1 }); // Sort by popularity

    res.json(touristPlaces);
  } catch (error) {
    console.error('Error fetching tourist places:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

