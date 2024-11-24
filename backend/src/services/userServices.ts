import { PrismaClient } from '@prisma/client';
import catchQuery from '../utils/catchQuery';
import { User, NewUser, UserWithoutRelations, UserMinimal } from '../types';
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

export const getUserByEmailMinimal = async (
  email: string,
): Promise<Express.User | null> => {
  return await catchQuery(() =>
    prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    }),
  );
};

export const getUserByIdMinimal = async (
  id: number,
): Promise<Express.User | null> => {
  return await catchQuery(() =>
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    }),
  );
};
