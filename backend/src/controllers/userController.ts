import bcrypt from 'bcryptjs';
import * as userServices from '../services/userServices';

export async function newUser(req, res) {
  // check validation here

  const { email, firstName, lastName, password, bio, profilePictureUrl } =
    req.body;

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
    bio,
    profilePictureUrl,
  });

  if (!newUser) return res.status(500).send('User could not be created');

  // add session logic to log in user and change this below
  return res.status(201).json({
    message: 'User created successfully',
    newUser,
  });
}
