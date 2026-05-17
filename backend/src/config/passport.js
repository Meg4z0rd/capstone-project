const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const UserModel = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || "http://localhost:5000"}/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value;

        if (!email) {
          return done(
            new Error("Email tidak tersedia dari akun Google."),
            null,
          );
        }

        const user = await UserModel.findOrCreateGoogle({
          googleId: profile.id,
          name: profile.displayName,
          email,
          avatar,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

// Session serialize/deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
