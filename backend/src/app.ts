import express from 'express';
import session from 'express-session';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import cors from 'cors';
import { Strategy as LocalStrategy } from 'passport-local';
import { getUserByEmail } from './services/userServices';
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
    cookie: {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Adjust for CSRF prevention
      maxAge: 1000 * 60 * 60 * 24, // Optional: 1 day expiration for the session cookie
    },
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
        //sets the user object in passport
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  // only storing user.id in session
  done(null, user.id);
});

passport.deserializeUser((id: number, done) => {
  // passport attaches id to req.user for subsequent requests
  done(null, { id });
});

app.use((req, res, next) => {
  next();
});

app.use(router);

const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Express app listening on port ${PORT}!`),
);
