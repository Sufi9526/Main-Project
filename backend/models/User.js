import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // --- Forgot Password-ന് വേണ്ടി പുതുതായി ചേർക്കുന്നത് ---
    resetPasswordToken: {
      type: String,
      default: undefined,
    },
    resetPasswordExpires: {
      type: Date,
      default: undefined,
    },
    // --------------------------------------------------
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;