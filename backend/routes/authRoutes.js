import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updatePassword
} from "../controllers/authController.js";

const router = express.Router();

// --- നിലവിലുള്ള റൂട്ടുകൾ (No Changes) ---
router.post("/signup", registerUser);
router.post("/login", loginUser);

// --- പുതുതായി ചേർക്കുന്ന Forgot & Reset റൂട്ടുകൾ ---
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/update-password", updatePassword);

export default router; // ✅ THIS LINE FIXES EVERYTHING