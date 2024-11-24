import express from 'express';
import session from 'express-session';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import cors from 'cors';
import { Strategy as LocalStrategy } from 'passport-local';
import {
  getUserByEmail,
  getUserByEmailMinimal,
  getUserById,
  getUserByIdMinimal,
} from './services/userServices';
import router from './routes/router';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (
      email: string,
      password: string,
      done: (
        error: any,
        user?: Express.User | false,
        options?: { message: string },
      ) => void,
    ) => {
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
    const user = await getUserByIdMinimal(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(router);

const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Express app listening on port ${PORT}!`),
);
