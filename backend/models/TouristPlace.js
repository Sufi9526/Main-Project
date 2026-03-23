import mongoose from 'mongoose';

const touristPlaceSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  averageVisitDuration: {
    type: Number, // in hours
    required: true,
  },
  openingTime: {
    type: String,
    required: true,
  },
  closingTime: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['historical', 'nature', 'religious', 'entertainment', 'museum', 'beach', 'adventure'],
    required: true,
  },
  popularity: {
    type: Number, // 1-10 scale
    required: true,
  },
}, {
  timestamps: true,
});

const TouristPlace = mongoose.model('TouristPlace', touristPlaceSchema);

export default TouristPlace;

