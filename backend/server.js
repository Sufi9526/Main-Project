import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import travelRoutes from './routes/travel.js';
import touristPlacesRoutes from './routes/touristPlaces.js';
import hotelsRoutes from './routes/hotels.js';
import itineraryRoutes from './routes/itinerary.js';
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contact.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

/* ================= CORS SETUP ================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://main-project-4b3u.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Handle preflight (VERY IMPORTANT)
app.options("*", cors());
/* ============================================== */

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/travel', travelRoutes);
app.use('/api/tourist-places', touristPlacesRoutes);
app.use('/api/hotels', hotelsRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Travel Planner API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});