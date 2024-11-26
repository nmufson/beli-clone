import { PrismaClient } from '@prisma/client';
import catchQuery from '../utils/catchQuery';
import {
  User,
  NewUser,
  UserWithoutRelations,
  UserMinimal,
  FooterInfo,
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

export const getUserWithFollowing = async (userId: number) => {
  return await catchQuery(() =>
    prisma.user.findUnique({
      where: { id: userId },
      include: { following: true },
    }),
  );
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
