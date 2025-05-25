const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const passport = require('passport');
const session = require('express-session');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Passport config
require('./config/passport');

// Create Express app
const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(require('cookie-parser')());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Express session
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Route files
const authRoutes = require('./routes/auth');
const depositRoutes = require('./routes/deposits');
const withdrawalRoutes = require('./routes/withdrawals');
const stakingRoutes = require('./routes/staking');
const referralRoutes = require('./routes/referrals');
const usersRoutes = require('./routes/users');
const ticketRoutes = require('./routes/tickets');
const settingsRoutes = require('./routes/settings');
const adminSettingsRoutes = require('./routes/adminSettings');
const forumRoutes = require('./routes/forum');
const notificationRoutes = require('./routes/notifications');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/staking', stakingRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handler middleware
app.use(errorHandler);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
