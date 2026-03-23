import express from 'express';
import { generateItineraryController, generateHotelItineraryController } from '../controllers/itineraryController.js';

const router = express.Router();

router.post('/generate', generateItineraryController);
router.post('/generate-from-hotel', generateHotelItineraryController);

export default router;
