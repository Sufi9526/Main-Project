import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
    userId: {
    type: String, 
    required: true,
},
    destination: {
        type: String,
        required: true,
    },
    numberOfDays: {
        type: Number,
        required: true,
    },
    startTime: {
        type: String,
    },
    hotel: {
        name: String,
        address: String,
        location: String
    },
    plans: [{
        day: Number,
        noPlaces: Boolean,
        message: String,
        places: [{
            name: String,
            startTime: String,
            endTime: String,
            duration: Number,
            description: String,
            category: String,
            isStartingPoint: Boolean,
            isEndPoint: Boolean
        }]
    }],
    totalPlaces: Number
}, { timestamps: true });

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

export default Itinerary;
