import express from 'express';
import TouristPlace from '../models/TouristPlace.js';
import Hotel from '../models/Hotel.js';
import Itinerary from '../models/Itinerary.js';
import { generateItinerary, generateHotelItinerary } from '../controllers/itineraryController.js';

const router = express.Router();

// Generate itinerary for tourist places
router.post('/generate', async (req, res) => {
  try {
    const { location, startTime, numberOfDays, selectedPlaceIds } = req.body;

    if (!location || !startTime || !numberOfDays) {
      return res.status(400).json({ message: 'Location, start time, and number of days are required' });
    }

    const query = { location: { $regex: new RegExp(location, 'i') } };

    if (selectedPlaceIds && Array.isArray(selectedPlaceIds) && selectedPlaceIds.length > 0) {
      query._id = { $in: selectedPlaceIds };
    }

    const touristPlaces = await TouristPlace.find(query);

    if (touristPlaces.length === 0) {
      return res.status(404).json({ message: 'No tourist places found for this location' });
    }

    const generated = generateItinerary(touristPlaces, startTime, parseInt(numberOfDays));

    res.json({
      location,
      numberOfDays: parseInt(numberOfDays),
      startTime,
      itinerary: generated.itinerary,
      totalPlaces: touristPlaces.length,
      includedPlacesCount: generated.includedPlacesCount
    });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate itinerary from hotel
router.post('/generate-from-hotel', async (req, res) => {
  try {
    const { hotelId, checkInTime, numberOfDays, selectedPlaceIds } = req.body;

    if (!hotelId || !checkInTime || !numberOfDays) {
      return res.status(400).json({ message: 'Hotel ID, check-in time, and number of days are required' });
    }

    const hotel = await Hotel.findById(hotelId).populate('nearbyTouristPlaces');

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    let touristPlacesToUse = hotel.nearbyTouristPlaces;

    if (touristPlacesToUse.length === 0) {
      return res.status(404).json({ message: 'No nearby tourist places found for this hotel' });
    }

    if (selectedPlaceIds && Array.isArray(selectedPlaceIds) && selectedPlaceIds.length > 0) {
      touristPlacesToUse = touristPlacesToUse.filter(place =>
        selectedPlaceIds.includes(place._id.toString())
      );
    }

    const generated = generateHotelItinerary(
      hotel,
      touristPlacesToUse,
      checkInTime,
      parseInt(numberOfDays)
    );

    res.json({
      hotel: {
        name: hotel.name,
        address: hotel.address,
        location: hotel.location,
      },
      numberOfDays: parseInt(numberOfDays),
      checkInTime,
      itinerary: generated.itinerary,
      totalPlaces: hotel.nearbyTouristPlaces.length,
      includedPlacesCount: generated.includedPlacesCount
    });
  } catch (error) {
    console.error('Error generating hotel itinerary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save itinerary
router.post('/save', async (req, res) => {
  try {
    const { userId, email, destination, numberOfDays, startTime, hotel, plans, totalPlaces } = req.body;

    if (!userId || !destination || !plans || !email) {
      return res.status(400).json({ message: 'userId, email, destination, and plans are required' });
    }

    const newItinerary = new Itinerary({
      userId,
      email, // 🔥 NEW (important)
      destination,
      numberOfDays,
      startTime,
      hotel,
      plans,
      totalPlaces
    });

    await newItinerary.save();

    res.status(201).json({
      message: 'Itinerary saved successfully',
      itinerary: newItinerary
    });
  } catch (error) {
    console.error('Error saving itinerary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user saved itineraries (🔥 UPDATED)
router.get('/saved', async (req, res) => {
  try {
    const { userId, email } = req.query;

    if (!userId && !email) {
      return res.status(400).json({ message: 'userId or email required' });
    }

    const itineraries = await Itinerary.find({
      $or: [
        { userId },
        { email }
      ]
    }).sort({ createdAt: -1 });

    res.json(itineraries);
  } catch (error) {
    console.error('Error fetching saved itineraries:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a saved itinerary
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { plans, totalPlaces, numberOfDays } = req.body;

    if (!plans) {
      return res.status(400).json({ message: 'Plans data is required for update' });
    }

    const updateData = { plans, totalPlaces };
    if (numberOfDays) updateData.numberOfDays = numberOfDays;

    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedItinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.json({
      message: 'Itinerary updated successfully',
      itinerary: updatedItinerary
    });
  } catch (error) {
    console.error('Error updating itinerary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a saved itinerary
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const itinerary = await Itinerary.findByIdAndDelete(id);

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;