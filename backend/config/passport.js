const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const crypto = require('crypto');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
      passReqToCallback: true // Add this to access the request
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Generate random password for Google auth users
        const randomPassword = crypto.randomBytes(16).toString('hex');
        const userReferralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
        
        // Get referral code from session or query
        const referralCode = req.session?.referralCode || req.query?.ref;
        
        // Create new user
        const newUser = await User.create({
          email: profile.emails[0].value,
          password: randomPassword,
          googleId: profile.id,
          referralCode: userReferralCode,
          referredBy: referralCode
        });

        // Mark user as new for the callback handler
        newUser.isNew = true;
        
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
