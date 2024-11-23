import { PrismaClient } from '@prisma/client';
import catchQuery from '../utils/catchQuery';
import { NewUserData, User } from '../types';

const prisma = new PrismaClient();

export async function newUser({
  email,
  hashedPassword,
  firstName,
  lastName,
}: NewUserData) {
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

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await catchQuery(() =>
    prisma.user.findUnique({
      where: { email },
    }),
  );
};

export const getUserById = async (id: number): Promise<User | null> => {
  return await catchQuery(() =>
    prisma.user.findUnique({
      where: { id },
    }),
  );
};
