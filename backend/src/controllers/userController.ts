import bcrypt from 'bcryptjs';
import passport, { session } from 'passport';
import * as userServices from '../services/userServices';

import { Request, Response, NextFunction } from 'express';
import { NewUser, User, AuthInfo } from '../types';

export async function checkEmail(req: Request, res: Response): Promise<void> {
  const { email } = req.body;

  const user = await userServices.getUserByEmail(email);
  if (user) {
    res.status(200).json({ available: false });
    return;
  }
  res.status(200).json({ available: true });
  return;
}

export async function signUpUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // check validation here

  const { email, firstName, lastName, password, confirmPassword } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingEmail = await userServices.getUserByEmail(email);
  if (existingEmail) {
    res.status(400).json({ message: 'Email already in use' });
    return;
  }

  const newUser = await userServices.newUser({
    email,
    hashedPassword,
    firstName,
    lastName,
  });

  if (!newUser) {
    res.status(500).send('User could not be created');
    return;
  }

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

export async function logInUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  passport.authenticate(
    'local',
    async (err: Error, user: User, info: AuthInfo) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res
          .status(401)
          .json({ message: info?.message || 'Authentication failed' });
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        console.log('Logged in user:', user);
        return res.status(200).json({
          message: 'User logged in successfully',
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        });
      });
    },
  )(req, res, next);
}

export async function logOutUser(req: Request, res: Response) {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('An error occurred while logging out.');
    }
    res.redirect('/');
  });
}

export async function getFooterInfo(req: Request, res: Response) {
  const userId = req.user?.id;

  const footerInfo = await userServices.getFooterInfo(userId);

  if (!footerInfo) {
    res.status(404).json({ message: 'Failed to fetch footer info' });
    return;
  }

  const userFooterInfo = {
    firstNameInitial: footerInfo?.firstName[0],
    lastNameInitial: footerInfo?.lastName[0],
    imageURL: footerInfo?.profilePictureUrl,
  };

  res.status(200).json({
    message: 'Footer info retrieved successfully',
    userFooterInfo,
  });
}

export const getUserProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sessionUserId = req.user?.id;

  const { userIdParam } = req.params;
  const userId = parseInt(userIdParam);

  if (sessionUserId !== userId) return;
  // make this validation better
  // can only update the user if the session user is the same

  let user;
  if (userId) {
    user = await userServices.getUserById(userId);
  }

  if (!user) {
    res.status(500).json({ message: 'Failed to retrieve user' });
  }

  res.status(200).json({ message: 'User retrieved successfully', user });
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sessionUserId = req.user?.id;

  const { userIdParam } = req.params;
  const userId = parseInt(userIdParam);

  if (sessionUserId !== userId) return;
  // make this validation better
  // can only update the user if the session user is the same

  const { firstName, lastName, imageUrl, bio } = req.body;

  let updatedUser;
  if (userId) {
    updatedUser = await userServices.updateUserProfile(userId, {
      firstName,
      lastName,
      profilePictureUrl: imageUrl,
      bio,
    });
  }

  if (!updatedUser) {
    res.status(400).json({ message: 'Failed to update user' });
    return;
  }

  res.status(200).json({
    message: 'User profile updated successfully',
    updatedUser,
  });
};

export const sendFollowRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { senderId, receiverId } = req.body;

  const newFollowRequest = await userServices.newFollowRequest({
    senderId,
    receiverId,
  });

  if (!newFollowRequest) {
    res.status(500).json({ message: 'Follow request could not be created' });
    return;
  }

  res
    .status(201)
    .json({ message: 'Follow request sent successfully', newFollowRequest });
  return;
};

export const affectFollowRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sessionUserId = req.user?.id;
  const { senderId, receiverId, status } = req.body;

  if (receiverId !== sessionUserId) {
    res
      .status(403)
      .json({ message: 'Forbidden: You cannot affect this request' });
    return;
  }

  const deletedFollowRequest = await userServices.deleteFollowRequest(
    senderId,
    receiverId,
  );

  if (!deletedFollowRequest) {
    res.status(500).json({ message: 'Failed to delete follow request' });
    return;
  }
  if (status === 'ACCEPTED') {
    const newFollower = await userServices.addUserFollower(
      senderId,
      receiverId,
    );
    if (!newFollower) {
      res
        .status(500)
        .json({ message: 'Failed to create follower relationship' });
      return;
    }

    res.status(201).json({
      message: 'Follow request accepted successfully',
      newFollower,
    });
  } else if (status === 'REJECTED') {
    res.status(200).json({
      message: 'Follow request rejected successfully',
    });
  } else {
    res.status(400).json({
      message: 'Invalid status. Status must be "ACCEPTED" or "REJECTED".',
    });
  }
};

export const cancelFollowRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sessionUserId = req.user?.id;
  const { senderId, receiverId, status } = req.body;

  if (senderId !== sessionUserId) {
    res
      .status(403)
      .json({ message: 'Forbidden: You cannot cancel this request' });
    return;
  }

  const deletedFollowRequest = await userServices.deleteFollowRequest(
    senderId,
    receiverId,
  );

  if (!cancelFollowRequest) {
    res.status(500).json({ message: 'Failed to cancel follow request' });
    return;
  } else {
    res.status(204).send();
    return;
  }
};
