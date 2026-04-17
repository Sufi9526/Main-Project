import mongoose from 'mongoose';

const travelOptionSchema = new mongoose.Schema({
  fromLocation: {
    type: String,
    required: true,
  },
  toLocation: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    enum: ['bus', 'train'],
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  arrivalTime: {
    type: String,
    required: true,
  },
  travelDuration: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: false,
  },
  dayOfWeek: {
    type: String,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true,
  },
  operatorName: {
    type: String,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

travelOptionSchema.pre('validate', function deriveDayFromDate(next) {
  if (!this.dayOfWeek && this.date) {
    const parsedDate = new Date(this.date);
    if (!Number.isNaN(parsedDate.getTime())) {
      this.dayOfWeek = parsedDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
    }
  }
  next();
});

const TravelOption = mongoose.model('TravelOption', travelOptionSchema);

export default TravelOption;
