import express from 'express';
import Hotel from '../models/Hotel.js';
import TouristPlace from '../models/TouristPlace.js';

const router = express.Router();

// Get hotels by location
router.get('/:location', async (req, res) => {
  try {
    const { location } = req.params;

    const hotels = await Hotel.find({
      location: { $regex: new RegExp(location, 'i') },
    })
      .populate('nearbyTouristPlaces')
      .sort({ rating: -1 });

    res.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get specific hotel by ID
router.get('/detail/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('nearbyTouristPlaces');

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

