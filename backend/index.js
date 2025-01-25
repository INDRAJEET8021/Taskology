require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User"); // Adjust path
const cors = require("cors"); // For handling CORS
const nodemailer = require("nodemailer");
const authenticate = require("./middleware/authenticate");
const feedRoute = require("./routes/feedRoutes");
const taskRoute = require("./routes/taskRoutes");
const login = require("./routes/auth/login");
const register = require("./routes/auth/register");
const forgotPassword = require("./routes/auth/password");
const resetPassword = require("./routes/auth/password");
const passport = require('passport');
const jwt = require("jsonwebtoken");
const session = require('express-session');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = process.env.MONGO_CLOUD;  //Cloud Database

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(cors({ origin: 'https://taskology-mu.vercel.app', credentials: true }));


const MongoDB = process.env.DB_CONFIG;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection Successful"))
  .catch((err) => console.error("Database connection error:", err));


app.use(express.json()); 

// O-Auth
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // User's Google profile information
      // Save or find user in the database
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());


// Google Login
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google Callback
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),

  async (req, res) => {
    const { displayName, emails } = req.user;
    const email = emails[0].value;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        username: displayName,
        email: email,
        password:'na'
        // googleId: id, // Save Google ID
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.redirect(`https://taskology-mu.vercel.app/dashboard?token=${token}`);  }
);

// Logout
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Protected Route (Dashboard)
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome ${req.user.displayName}!`);
  } else {
    res.redirect('/');
  }
});


// Registration Route
app.use("/auth", register);
// Login Route
app.use("/auth", login);
// For feed Routes
app.use("/feed", feedRoute);
// For task routes
app.use("/task", taskRoute);
// Route to generate and send OTP
app.use("/passwordConfig", forgotPassword);
// Route to verify OTP and reset password
app.use("/passwordConfig", resetPassword);

// To check
app.get("/protected", authenticate, (req, res) => {
  res.status(200).json({
    message: `Hello, ${req.user.username}! You accessed a protected route.`,
  });
});
// Start the Server
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
