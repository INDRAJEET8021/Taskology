const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const nodemailer = require("nodemailer");

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Replace with your email
    pass: process.env.EMAIL_PASS, // Replace with your email password
  },
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP and expiration in the database
    user.resetOtp = otp;
    user.otpExpiresAt = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
    await user.save();

    // Send the OTP to the user's email
    try{

      await transporter.sendMail({
        from: "indrajeetrai903@gmail.com",
        to: email,
        subject: "Password Reset OTP",
        text: `Your password reset OTP is: ${otp}. It is valid for 15 minutes.`,
      });
  
      res.status(200).json({
        success: true,
        message: "OTP has been sent to your email",
      });
    }catch(emailError){
      console.error("Error sending email:", emailError);
      return res.status(500).json({
        message: "There was an issue sending the OTP.please Check Email or try letter",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error, try again later" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and new password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check OTP
    if (user.resetOtp !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Directly update the password without hashing(Oh presave hook will hash confusion can be )
    user.password = newPassword; 
    user.resetOtp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in reset-password:", error);
    res.status(500).json({ message: "Server error, try again later" });
  }
});

module.exports = router;
