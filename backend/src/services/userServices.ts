import { PrismaClient, FollowRequestStatus } from '@prisma/client';

import catchQuery from '../utils/catchQuery';
import {
  User,
  NewUser,
  UserWithoutRelations,
  UserMinimal,
  FooterInfo,
  FollowRequest,
} from '../types';
import { selectFields } from 'express-validator/lib/field-selection';

const prisma = new PrismaClient();

export async function newUser({
  email,
  hashedPassword,
  firstName,
  lastName,
}: NewUser): Promise<UserWithoutRelations> {
  return await catchQuery(() =>
    prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    }),
  );
}

export const getUserByEmail = async (
  email: string,
): Promise<UserWithoutRelations | null> => {
  return await catchQuery(() =>
    prisma.user.findUnique({
      where: { email },
    }),
  );
};

export const getUserById = async (
  id: number,
): Promise<UserWithoutRelations | null> => {
  return await catchQuery(() =>
    prisma.user.findUnique({
      where: { id },
    }),
  );
};

export const getUsersUserFollowing = async (
  userId: number,
): Promise<
  | {
      id: number;
      firstName: string;
      lastName: string;
      profilePictureUrl: string | null;
    }[]
  | null
> => {
  const result = await catchQuery(() =>
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        following: {
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePictureUrl: true,
              },
            },
          },
        },
      },
    }),
  );

  if (!result) return null;

  return result.following.map((following) => following.user);
};

export const updateUserProfile = async (
  id: number,
  fieldsToUpdate: {
    firstName?: string;
    lastName?: string;
    profilePictureUrl?: string;
    bio?: string;
  },
) => {
  const filteredFields = Object.fromEntries(
    Object.entries(fieldsToUpdate).filter(([_, value]) => value !== undefined),
  );

  return await catchQuery(() =>
    prisma.user.update({
      where: { id },
      data: filteredFields,
    }),
  );
};

export const getFooterInfo = async (
  id: number | undefined,
): Promise<FooterInfo | null> => {
  return await catchQuery(() =>
    prisma.user.findUnique({
      where: { id },
      select: {
        firstName: true,
        lastName: true,
        profilePictureUrl: true,
      },
    }),
  );
};

export const newFollowRequest = async (data: {
  senderId: number;
  receiverId: number;
}) => {
  return await catchQuery(() =>
    prisma.followRequest.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId,
        status: 'PENDING',
      },
    }),
  );
};

export const affectFollowRequest = async (
  senderId: number,
  receiverId: number,
  status: FollowRequestStatus,
) => {
  return await catchQuery(() =>
    prisma.followRequest.update({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId,
        },
      },
      data: { status },
    }),
  );
};

export const deleteFollowRequest = async (
  senderId: number,
  receiverId: number,
) => {
  return await catchQuery(() =>
    prisma.followRequest.delete({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId,
        },
      },
    }),
  );
};

export const addUserFollower = async (senderId: number, receiverId: number) => {
  return await catchQuery(() =>
    prisma.userFollower.create({
      data: {
        userId: receiverId,
        followerId: senderId,
      },
    }),
  );
};
