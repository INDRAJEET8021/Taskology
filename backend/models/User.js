const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema
const userSchema = new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      resetOtp: { type: Number }, // Store OTP
      otpExpiresAt: { type: Date }, // Store OTP expiration time
    },
    { timestamps: true }
  );

// Hash the password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
