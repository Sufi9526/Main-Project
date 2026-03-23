import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  checkInTime: {
    type: String,
    required: true,
  },
  checkOutTime: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  amenities: {
    type: [String],
    default: [],
  },
  nearbyTouristPlaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TouristPlace',
  }],
}, {
  timestamps: true,
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;

