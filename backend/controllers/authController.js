import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// --- Register User (No Changes) ---
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Login User (No Changes) ---
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Forgot Password Function (No Changes) ---
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "ഈ ഇമെയിലിൽ യൂസർ നിലവിലില്ല" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 600000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<h4>പാസ്‌വേഡ് റീസെറ്റ് ചെയ്യാൻ താഴെ കാണുന്ന ലിങ്കിൽ ക്ലിക്ക് ചെയ്യുക:</h4>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>ഈ ലിങ്ക് 10 മിനിറ്റ് കഴിഞ്ഞ് കാലാവധി തീരുന്നതാണ്.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "റീസെറ്റ് ലിങ്ക് ഇമെയിൽ അയച്ചിട്ടുണ്ട്" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- പുതുതായി ചേർക്കുന്ന Step 3: Reset Password Function ---

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // 1. ടോക്കൺ വാലിഡ് ആണോ എന്ന് പരിശോധിക്കുന്നു
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // കാലാവധി കഴിഞ്ഞിട്ടില്ലെന്ന് ഉറപ്പാക്കുന്നു
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // 2. പുതിയ പാസ്‌വേഡ് ഹാഷ് ചെയ്യുന്നു
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. പാസ്‌വേഡ് അപ്ഡേറ്റ് ചെയ്യുന്നു
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful! You can now login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Update Password (from Profile) ---
export const updatePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // 3. Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update and save
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ message: "Failed to update password" });
  }
};