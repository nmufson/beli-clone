import bcrypt from 'bcryptjs';
import passport from 'passport';
import * as userServices from '../services/userServices';

export async function signUpUser(req, res, next) {
  // check validation here

  const { email, firstName, lastName, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingEmail = await userServices.getUserByEmail(email);
  if (existingEmail) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const newUser = await userServices.newUser({
    email,
    hashedPassword,
    firstName,
    lastName,
  });

  if (!newUser) return res.status(500).send('User could not be created');

  req.login(newUser, (err) => {
    if (err) {
      return next(err);
    }

    return res.status(201).json({
      message: 'User created and logged in successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });
  });
}

export async function logInUser(req, res, next) {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.session.logInErrors = {
        // ???
        email: info.field === 'email' ? info.message : '',
        password: info.field === 'password' ? info.message : '',
      };
      req.session.logInEmail = req.body.email;
      return res.redirect('/log-in');
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
}

export async function logOutUser(req, res) {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('An error occurred while logging out.');
    }
    res.redirect('/');
  });
}
