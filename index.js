require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const cryptoRoutes = require('./routes/cryptoRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
// Important: cors must be configured to allow credentials (cookies) in production 
// so the frontend can receive and send the JWT cookie.
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL // Will be added during deployment
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests) 
    // or allowed origins
    if(!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parses cookies

// Routes
// Note: As per README, routes might not be namespaced under /api, 
// so they can be mounted at root. 
app.use('/', authRoutes);
app.use('/crypto', cryptoRoutes);

// Error Handling Middleware defaults
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
