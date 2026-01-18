import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateOtp } from "../utils/otp.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { sendOtpMail } from "../utils/sendOtpMail.js";

const router = express.Router();

/* ================= REGISTER ================= */

// SEND OTP
router.post("/register/send-otp", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const existingUser = await User.findOne({ email });

  // 🚫 Already registered & verified
  if (existingUser && existingUser.isVerified) {
    return res.status(400).json({ message: "User already exists" });
  }

  const otp = generateOtp();
  const hashedPassword = await hashPassword(password);

  if (existingUser) {
    // 🔁 RESEND OTP (overwrite old)
    existingUser.name = name;
    existingUser.password = hashedPassword;
    existingUser.otp = otp;
    existingUser.otpExpiresAt = Date.now() + 5 * 60 * 1000;
    await existingUser.save();
  } else {
    // 🆕 NEW USER
    await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt: Date.now() + 5 * 60 * 1000
    });
  }

  await sendOtpMail(email, otp, "registration");

  res.json({ success: true, message: "OTP sent for registration" });
});

// VERIFY OTP
router.post("/register/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (
    !user ||
    user.otp !== otp ||
    user.otpExpiresAt < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  res.json({ success: true, message: "Registration successful" });
});

/* ================= LOGIN ================= */

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.isVerified) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await comparePassword(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token,
    user: {
      name: user.name,
      email: user.email
    }
  });
});

/* ================= FORGOT PASSWORD ================= */

// SEND OTP
router.post("/forgot-password/send-otp", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
  await user.save();

  await sendOtpMail(email, otp, "password reset");

  res.json({ success: true, message: "OTP sent for password reset" });
});

// VERIFY OTP & RESET PASSWORD
router.post("/forgot-password/verify-otp", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (
    !user ||
    user.otp !== otp ||
    user.otpExpiresAt < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.password = await hashPassword(newPassword);
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
});

// RESEND OTP
router.post("/register/resend-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  const user = await User.findOne({ email });

  if (!user || user.isVerified) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
  await user.save();

  await sendOtpMail(email, otp, "registration");

  res.json({ success: true, message: "OTP resent successfully" });
});


export default router;
