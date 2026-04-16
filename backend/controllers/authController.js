import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
const BASE_URL = process.env.FRONTEND_URL;

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
      return res.status(404).json({ message: "No User Exists With This Email" });
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

    // const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const resetUrl = `${BASE_URL}/reset-password/${resetToken}`;
    

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<h4>Click The Link Below To Reset Your Password:</h4>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>This Link Will Expire After 10 Minutes</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "The Reset Link Has Been Sent To Your Email" });
    // console.log(Error);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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