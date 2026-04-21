import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TravelOption from '../models/TravelOption.js';
import TouristPlace from '../models/TouristPlace.js';
import Hotel from '../models/Hotel.js';

dotenv.config();

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const travelOnlyMode = process.argv.includes('--travel-only');

const getDayFromDateString = (dateString) => {
  const dateObj = new Date(`${dateString}T00:00:00Z`);
  if (Number.isNaN(dateObj.getTime())) return null;
  return DAYS_OF_WEEK[dateObj.getUTCDay()];
};

const shiftTimeByMinutes = (timeString, minutesToShift) => {
  const [hoursStr, minutesStr] = String(timeString).split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return timeString;
  }

  const totalMinutes = ((hours * 60 + minutes + minutesToShift) % (24 * 60) + (24 * 60)) % (24 * 60);
  const shiftedHours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const shiftedMinutes = String(totalMinutes % 60).padStart(2, '0');
  return `${shiftedHours}:${shiftedMinutes}`;
};

const createWeeklyTravelOptions = (baseOptions) => {
  const TRAIN_NAMES = [
    'Western Horizon Express',
    'Silver Line Express',
    'Ocean Breeze Express',
    'Mountain King Express',
    'Sapphire Express',
    'Golden Arrow Express',
    'Valley Runner Express',
    'Emerald Coast Express',
    'Blue Wave Express',
    'Night Star Express',
    'Rapid Link Express',
    'Thunder Rail Express',
    'Crystal Line Express',
    'Sunset Express',
    'Royal Track Express',
  ];

  const BUS_NAMES = [
    'Speed Rider',
    'Urban Glide',
    'Express Wheels',
    'Highway King',
    'City Sprinter',
    'Rapid Move',
    'Smart Ride',
    'Turbo Travels',
    'Elite Journey',
    'Swift Wheels',
    'Comfort Line',
    'Prime Travels',
    'Zoom Rider',
    'Easy Move',
    'Star Travels',
  ];

  return DAYS_OF_WEEK.flatMap((day, dayIndex) => {
    const minuteShift = dayIndex * 10;
    const seatAdjustment = dayIndex % 3;
    const priceAdjustment = dayIndex * 20;

    return baseOptions.map((option, optionIndex) => {
      const namePool = option.mode === 'train' ? TRAIN_NAMES : BUS_NAMES;
      const nameIndex = (dayIndex * 3 + optionIndex) % namePool.length;
      const selectedOperator = namePool[nameIndex];

      return {
        ...option,
        dayOfWeek: day,
        departureTime: shiftTimeByMinutes(option.departureTime, minuteShift),
        arrivalTime: shiftTimeByMinutes(option.arrivalTime, minuteShift),
        availableSeats: Math.max(5, option.availableSeats - seatAdjustment),
        price: option.price + priceAdjustment,
        operatorName: selectedOperator,
      };
    });
  });
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const travelOptions = [
  // Mumbai to Goa
  { fromLocation: 'Mumbai', toLocation: 'Goa', mode: 'bus', departureTime: '08:00', arrivalTime: '18:00', travelDuration: '10h', date: '2025-11-10', operatorName: 'RedBus Express', availableSeats: 30, price: 1200 },
  { fromLocation: 'Mumbai', toLocation: 'Goa', mode: 'bus', departureTime: '14:00', arrivalTime: '00:00', travelDuration: '10h', date: '2025-11-10', operatorName: 'KPN Travels', availableSeats: 25, price: 1000 },
  { fromLocation: 'Mumbai', toLocation: 'Goa', mode: 'bus', departureTime: '20:00', arrivalTime: '06:00', travelDuration: '10h', date: '2025-11-10', operatorName: 'Paulo Travels', availableSeats: 20, price: 1500 },
  { fromLocation: 'Mumbai', toLocation: 'Goa', mode: 'train', departureTime: '07:00', arrivalTime: '18:30', travelDuration: '11h 30m', date: '2025-11-10', operatorName: 'Konkan Kanya Express', availableSeats: 50, price: 800 },
  { fromLocation: 'Mumbai', toLocation: 'Goa', mode: 'train', departureTime: '11:00', arrivalTime: '22:00', travelDuration: '11h', date: '2025-11-10', operatorName: 'Mandovi Express', availableSeats: 45, price: 750 },
  { fromLocation: 'Mumbai', toLocation: 'Goa', mode: 'train', departureTime: '16:30', arrivalTime: '04:00', travelDuration: '11h 30m', date: '2025-11-10', operatorName: 'Jan Shatabdi', availableSeats: 60, price: 900 },
  
  // Delhi to Agra
  { fromLocation: 'Delhi', toLocation: 'Agra', mode: 'bus', departureTime: '06:00', arrivalTime: '09:30', travelDuration: '3h 30m', date: '2025-11-10', operatorName: 'UP Roadways', availableSeats: 35, price: 400 },
  { fromLocation: 'Delhi', toLocation: 'Agra', mode: 'bus', departureTime: '10:00', arrivalTime: '13:30', travelDuration: '3h 30m', date: '2025-11-10', operatorName: 'AC Volvo Service', availableSeats: 28, price: 600 },
  { fromLocation: 'Delhi', toLocation: 'Agra', mode: 'bus', departureTime: '15:00', arrivalTime: '18:30', travelDuration: '3h 30m', date: '2025-11-10', operatorName: 'VIP Travels', availableSeats: 22, price: 500 },
  { fromLocation: 'Delhi', toLocation: 'Agra', mode: 'train', departureTime: '06:00', arrivalTime: '08:00', travelDuration: '2h', date: '2025-11-10', operatorName: 'Gatimaan Express', availableSeats: 70, price: 750 },
  { fromLocation: 'Delhi', toLocation: 'Agra', mode: 'train', departureTime: '08:00', arrivalTime: '10:30', travelDuration: '2h 30m', date: '2025-11-10', operatorName: 'Taj Express', availableSeats: 80, price: 300 },
  { fromLocation: 'Delhi', toLocation: 'Agra', mode: 'train', departureTime: '14:00', arrivalTime: '16:30', travelDuration: '2h 30m', date: '2025-11-10', operatorName: 'Shatabdi Express', availableSeats: 65, price: 650 },
  
  // Bangalore to Mysore
  { fromLocation: 'Bangalore', toLocation: 'Mysore', mode: 'bus', departureTime: '07:00', arrivalTime: '10:00', travelDuration: '3h', date: '2025-11-10', operatorName: 'KSRTC', availableSeats: 40, price: 350 },
  { fromLocation: 'Bangalore', toLocation: 'Mysore', mode: 'bus', departureTime: '12:00', arrivalTime: '15:00', travelDuration: '3h', date: '2025-11-10', operatorName: 'Sharma Travels', availableSeats: 32, price: 400 },
  { fromLocation: 'Bangalore', toLocation: 'Mysore', mode: 'bus', departureTime: '18:00', arrivalTime: '21:00', travelDuration: '3h', date: '2025-11-10', operatorName: 'VRL Travels', availableSeats: 28, price: 450 },
  { fromLocation: 'Bangalore', toLocation: 'Mysore', mode: 'train', departureTime: '06:30', arrivalTime: '09:30', travelDuration: '3h', date: '2025-11-10', operatorName: 'Shatabdi Express', availableSeats: 55, price: 500 },
  { fromLocation: 'Bangalore', toLocation: 'Mysore', mode: 'train', departureTime: '11:00', arrivalTime: '14:30', travelDuration: '3h 30m', date: '2025-11-10', operatorName: 'Kaveri Express', availableSeats: 60, price: 250 },
  { fromLocation: 'Bangalore', toLocation: 'Mysore', mode: 'train', departureTime: '16:00', arrivalTime: '19:30', travelDuration: '3h 30m', date: '2025-11-10', operatorName: 'Chamundi Express', availableSeats: 50, price: 280 },
  
  // Chennai to Pondicherry
  { fromLocation: 'Chennai', toLocation: 'Pondicherry', mode: 'bus', departureTime: '06:30', arrivalTime: '09:30', travelDuration: '3h', date: '2025-11-10', operatorName: 'Parveen Travels', availableSeats: 30, price: 300 },
  { fromLocation: 'Chennai', toLocation: 'Pondicherry', mode: 'bus', departureTime: '11:00', arrivalTime: '14:00', travelDuration: '3h', date: '2025-11-10', operatorName: 'SRS Travels', availableSeats: 25, price: 350 },
  { fromLocation: 'Chennai', toLocation: 'Pondicherry', mode: 'bus', departureTime: '17:00', arrivalTime: '20:00', travelDuration: '3h', date: '2025-11-10', operatorName: 'Pothigai Travels', availableSeats: 28, price: 400 },
  { fromLocation: 'Chennai', toLocation: 'Pondicherry', mode: 'train', departureTime: '07:00', arrivalTime: '10:30', travelDuration: '3h 30m', date: '2025-11-10', operatorName: 'Pondicherry Express', availableSeats: 45, price: 200 },
  { fromLocation: 'Chennai', toLocation: 'Pondicherry', mode: 'train', departureTime: '13:00', arrivalTime: '16:30', travelDuration: '3h 30m', date: '2025-11-10', operatorName: 'Rock Fort Express', availableSeats: 50, price: 220 },
  { fromLocation: 'Chennai', toLocation: 'Pondicherry', mode: 'train', departureTime: '19:00', arrivalTime: '22:30', travelDuration: '3h 30m', date: '2025-11-10', operatorName: 'Chennai Mail', availableSeats: 40, price: 180 },
];

const touristPlaces = [
  // Goa
  { location: 'Goa', name: 'Baga Beach', description: 'Famous beach known for water sports and nightlife', averageVisitDuration: 3, openingTime: '00:00', closingTime: '23:59', category: 'beach', popularity: 9 },
  { location: 'Goa', name: 'Basilica of Bom Jesus', description: 'UNESCO World Heritage Site, 16th century church', averageVisitDuration: 1.5, openingTime: '09:00', closingTime: '18:30', category: 'historical', popularity: 8 },
  { location: 'Goa', name: 'Fort Aguada', description: 'Portuguese fort with lighthouse and panoramic views', averageVisitDuration: 2, openingTime: '09:00', closingTime: '18:00', category: 'historical', popularity: 8 },
  { location: 'Goa', name: 'Dudhsagar Falls', description: 'Four-tiered waterfall, one of India\'s tallest', averageVisitDuration: 4, openingTime: '08:00', closingTime: '17:00', category: 'nature', popularity: 9 },
  { location: 'Goa', name: 'Anjuna Flea Market', description: 'Vibrant market for shopping and local culture', averageVisitDuration: 2.5, openingTime: '08:00', closingTime: '18:00', category: 'entertainment', popularity: 7 },
  { location: 'Goa', name: 'Chapora Fort', description: 'Historic fort with stunning views of Vagator beach', averageVisitDuration: 1.5, openingTime: '09:00', closingTime: '17:30', category: 'historical', popularity: 7 },
  { location: 'Goa', name: 'Calangute Beach', description: 'The Queen of Beaches with water sports', averageVisitDuration: 3, openingTime: '00:00', closingTime: '23:59', category: 'beach', popularity: 8 },
  { location: 'Goa', name: 'Spice Plantation Tour', description: 'Experience authentic Goan spice farms', averageVisitDuration: 3, openingTime: '09:00', closingTime: '17:00', category: 'nature', popularity: 6 },
  
  // Agra
  { location: 'Agra', name: 'Taj Mahal', description: 'One of the Seven Wonders of the World', averageVisitDuration: 3, openingTime: '06:00', closingTime: '19:00', category: 'historical', popularity: 10 },
  { location: 'Agra', name: 'Agra Fort', description: 'UNESCO World Heritage Site, Mughal fortress', averageVisitDuration: 2, openingTime: '06:00', closingTime: '18:00', category: 'historical', popularity: 9 },
  { location: 'Agra', name: 'Fatehpur Sikri', description: 'Historic city built by Akbar, UNESCO site', averageVisitDuration: 3, openingTime: '06:00', closingTime: '18:00', category: 'historical', popularity: 8 },
  { location: 'Agra', name: 'Mehtab Bagh', description: 'Garden complex with view of Taj Mahal', averageVisitDuration: 1.5, openingTime: '06:00', closingTime: '18:00', category: 'nature', popularity: 7 },
  { location: 'Agra', name: 'Itmad-ud-Daulah Tomb', description: 'Beautiful marble mausoleum, Baby Taj', averageVisitDuration: 1.5, openingTime: '06:00', closingTime: '18:00', category: 'historical', popularity: 7 },
  { location: 'Agra', name: 'Akbar\'s Tomb', description: 'Magnificent tomb of Emperor Akbar', averageVisitDuration: 2, openingTime: '06:00', closingTime: '17:30', category: 'historical', popularity: 6 },
  
  // Mysore
  { location: 'Mysore', name: 'Mysore Palace', description: 'Magnificent royal palace with Indo-Saracenic architecture', averageVisitDuration: 2.5, openingTime: '10:00', closingTime: '17:30', category: 'historical', popularity: 10 },
  { location: 'Mysore', name: 'Chamundi Hills', description: 'Sacred hill with temple and panoramic city views', averageVisitDuration: 2, openingTime: '07:00', closingTime: '19:00', category: 'religious', popularity: 9 },
  { location: 'Mysore', name: 'Brindavan Gardens', description: 'Beautiful gardens with musical fountain', averageVisitDuration: 2.5, openingTime: '18:00', closingTime: '19:30', category: 'nature', popularity: 8 },
  { location: 'Mysore', name: 'Mysore Zoo', description: 'One of oldest and most popular zoos in India', averageVisitDuration: 3, openingTime: '08:30', closingTime: '17:30', category: 'entertainment', popularity: 8 },
  { location: 'Mysore', name: 'St. Philomena\'s Cathedral', description: 'Neo-Gothic style church, tallest in Asia', averageVisitDuration: 1, openingTime: '05:00', closingTime: '18:00', category: 'religious', popularity: 7 },
  { location: 'Mysore', name: 'Jaganmohan Palace Art Gallery', description: 'Art gallery with royal collections', averageVisitDuration: 1.5, openingTime: '08:30', closingTime: '17:30', category: 'museum', popularity: 6 },
  
  // Pondicherry
  { location: 'Pondicherry', name: 'Auroville', description: 'Experimental township promoting human unity', averageVisitDuration: 3, openingTime: '09:00', closingTime: '17:30', category: 'entertainment', popularity: 9 },
  { location: 'Pondicherry', name: 'Promenade Beach', description: 'Popular beach with French colonial buildings', averageVisitDuration: 2, openingTime: '00:00', closingTime: '23:59', category: 'beach', popularity: 8 },
  { location: 'Pondicherry', name: 'Paradise Beach', description: 'Serene beach accessible by boat', averageVisitDuration: 3, openingTime: '09:00', closingTime: '17:00', category: 'beach', popularity: 8 },
  { location: 'Pondicherry', name: 'Sri Aurobindo Ashram', description: 'Spiritual community and ashram', averageVisitDuration: 1.5, openingTime: '08:00', closingTime: '18:00', category: 'religious', popularity: 7 },
  { location: 'Pondicherry', name: 'French Quarter', description: 'Colonial architecture and vibrant streets', averageVisitDuration: 2.5, openingTime: '00:00', closingTime: '23:59', category: 'historical', popularity: 9 },
  { location: 'Pondicherry', name: 'Botanical Garden', description: 'Historic garden with diverse plant species', averageVisitDuration: 1.5, openingTime: '09:00', closingTime: '17:30', category: 'nature', popularity: 6 },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await TravelOption.deleteMany({});
    if (!travelOnlyMode) {
      await TouristPlace.deleteMany({});
      await Hotel.deleteMany({});
    }

    console.log('Existing data cleared');

    // Create day-wise travel data so each weekday has dedicated plans.
    const baseTravelOptions = travelOptions.map((option) => {
      const derivedDay = option.dayOfWeek || getDayFromDateString(option.date);
      return {
        ...option,
        dayOfWeek: derivedDay,
      };
    });

    const weeklyTravelOptions = createWeeklyTravelOptions(baseTravelOptions);

    await TravelOption.insertMany(weeklyTravelOptions);
    console.log('Travel options seeded');

    if (travelOnlyMode) {
      console.log('Travel-only seed completed successfully!');
      process.exit(0);
    }

    // Insert tourist places
    const insertedPlaces = await TouristPlace.insertMany(touristPlaces);
    console.log('Tourist places seeded');

    // Create hotels with references to nearby tourist places
    const goaTouristPlaces = insertedPlaces.filter(place => place.location === 'Goa').map(p => p._id);
    const agraTouristPlaces = insertedPlaces.filter(place => place.location === 'Agra').map(p => p._id);
    const mysoreTouristPlaces = insertedPlaces.filter(place => place.location === 'Mysore').map(p => p._id);
    const pondicherryTouristPlaces = insertedPlaces.filter(place => place.location === 'Pondicherry').map(p => p._id);

    const hotels = [
      // Goa Hotels
      {
        location: 'Goa',
        name: 'Taj Exotica Resort & Spa',
        address: 'Calwaddo, Benaulim, South Goa',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        rating: 4.8,
        pricePerNight: 8000,
        amenities: ['Pool', 'Spa', 'WiFi', 'Restaurant', 'Beach Access'],
        nearbyTouristPlaces: goaTouristPlaces.slice(0, 5),
      },
      {
        location: 'Goa',
        name: 'The Leela Goa',
        address: 'Mobor, Cavelossim, South Goa',
        checkInTime: '15:00',
        checkOutTime: '12:00',
        rating: 4.7,
        pricePerNight: 9000,
        amenities: ['Pool', 'Golf Course', 'Spa', 'WiFi', 'Multiple Restaurants'],
        nearbyTouristPlaces: goaTouristPlaces.slice(0, 6),
      },
      {
        location: 'Goa',
        name: 'Cidade de Goa',
        address: 'Vainguinim Beach, Dona Paula, North Goa',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        rating: 4.5,
        pricePerNight: 6000,
        amenities: ['Pool', 'Beach View', 'WiFi', 'Restaurant'],
        nearbyTouristPlaces: goaTouristPlaces,
      },

      // Agra Hotels
      {
        location: 'Agra',
        name: 'The Oberoi Amarvilas',
        address: 'Taj East Gate Road, Agra',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        rating: 4.9,
        pricePerNight: 12000,
        amenities: ['Taj View', 'Pool', 'Spa', 'Fine Dining', 'WiFi'],
        nearbyTouristPlaces: agraTouristPlaces,
      },
      {
        location: 'Agra',
        name: 'ITC Mughal',
        address: 'Taj Ganj, Agra',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        rating: 4.6,
        pricePerNight: 7000,
        amenities: ['Pool', 'Spa', 'Multiple Restaurants', 'WiFi', 'Garden'],
        nearbyTouristPlaces: agraTouristPlaces.slice(0, 4),
      },
      {
        location: 'Agra',
        name: 'Taj Hotel & Convention Centre',
        address: 'Taj Nagri Phase 2, Agra',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        rating: 4.4,
        pricePerNight: 5000,
        amenities: ['Pool', 'Restaurant', 'WiFi', 'Banquet Hall'],
        nearbyTouristPlaces: agraTouristPlaces.slice(0, 3),
      },

      // Mysore Hotels
      {
        location: 'Mysore',
        name: 'Lalitha Mahal Palace Hotel',
        address: 'T Narasipura Road, Siddhartha Nagar, Mysore',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        rating: 4.7,
        pricePerNight: 8000,
        amenities: ['Heritage Property', 'Pool', 'Restaurant', 'WiFi', 'Garden'],
        nearbyTouristPlaces: mysoreTouristPlaces,
      },
      {
        location: 'Mysore',
        name: 'The Windflower Resort',
        address: 'Royal Orchid, Nazarbad, Mysore',
        checkInTime: '13:00',
        checkOutTime: '11:00',
        rating: 4.6,
        pricePerNight: 6000,
        amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Activities'],
        nearbyTouristPlaces: mysoreTouristPlaces.slice(0, 4),
      },
      {
        location: 'Mysore',
        name: 'Radisson Blu Plaza Hotel',
        address: 'Vinoba Road, Jayalakshmipuram, Mysore',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        rating: 4.5,
        pricePerNight: 5500,
        amenities: ['Pool', 'Fitness Center', 'Restaurant', 'WiFi'],
        nearbyTouristPlaces: mysoreTouristPlaces.slice(0, 5),
      },

      // Pondicherry Hotels
      {
        location: 'Pondicherry',
        name: 'Le Dupleix',
        address: '5, Rue De La Caserne, White Town, Pondicherry',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        rating: 4.7,
        pricePerNight: 7000,
        amenities: ['Heritage Hotel', 'Pool', 'Restaurant', 'WiFi', 'French Architecture'],
        nearbyTouristPlaces: pondicherryTouristPlaces,
      },
      {
        location: 'Pondicherry',
        name: 'Palais de Mahe',
        address: '4, Bussy Street, Pondicherry',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        rating: 4.6,
        pricePerNight: 6500,
        amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Colonial Style'],
        nearbyTouristPlaces: pondicherryTouristPlaces.slice(0, 4),
      },
      {
        location: 'Pondicherry',
        name: 'The Promenade',
        address: '23, Goubert Avenue, Pondicherry',
        checkInTime: '13:00',
        checkOutTime: '11:00',
        rating: 4.5,
        pricePerNight: 5000,
        amenities: ['Beach View', 'Restaurant', 'WiFi', 'Terrace'],
        nearbyTouristPlaces: pondicherryTouristPlaces.slice(0, 5),
      },
    ];

    await Hotel.insertMany(hotels);
    console.log('Hotels seeded');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

