import mongoose, { Schema } from "mongoose";

const OTPs = new Schema(
  {
    Gotp: {
      type: Number,
      required: true,
    },
  userId: {
      type: String,
      ref: "Student",
      required: true,
      trim: true,
    },
    expiryAt: {
      type: Date,
      default: Date.now(),
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    isForget: {
      type: Boolean,
      default: false,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const TempOTP = mongoose.model("OTP", OTPs);
