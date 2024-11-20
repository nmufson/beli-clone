import { PrismaClient } from '@prisma/client';
import catchQuery from '../utils/catchQuery';
import { NewUserData } from '../types';

const prisma = new PrismaClient();

export async function newUser({
  email,
  hashedPassword,
  firstName,
  lastName,
  bio,
  profilePictureUrl,
}: NewUserData) {
  return await catchQuery(() =>
    prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        bio,
        profilePictureUrl,
      },
    }),
  );
}

export async function getUserByEmail(email: string) {
  return await catchQuery(() =>
    prisma.user.findUnique({
      where: { email },
    }),
  );
}
