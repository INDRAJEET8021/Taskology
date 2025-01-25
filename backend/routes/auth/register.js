const express=require('express')
const router = express.Router();
const User=require('../../models/User')

router.post("/register", async (req, res) => {
    // console.log("Incoming registration request:", req.body);
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username or Email already taken" });
      }
  
      const newUser = new User({ username, email, password });
      await newUser.save();
      console.log("User registered successfully:", newUser);
  
      res
        .status(201)
        .json({ success: true, message: "User registered successfully" });
    } catch (error) {
      console.error("Error in registration:", error);
      res.status(500).json({ message: "Server error, try again later" });
    }
  });

  module.exports = router;