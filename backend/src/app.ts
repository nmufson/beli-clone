import express from 'express';
import session from 'express-session';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
const LocalStrategy = require('passport-local').Strategy;
import { getUserByEmail, getUserById } from './services/userServices';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Used to sign the session ID cookie
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await getUserByEmail(email);

        if (!user) {
          return done(null, false, { message: 'Email not found' });
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
