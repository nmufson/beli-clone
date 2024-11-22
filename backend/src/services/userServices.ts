import { PrismaClient } from '@prisma/client';
import catchQuery from '../utils/catchQuery';
import { NewUserData } from '../types';

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

export async function getUserByEmail(email: string) {
  return await catchQuery(() =>
    prisma.user.findUnique({
      where: { email },
    }),
  );
}

export async function getUserById(id: number) {
  return await catchQuery(() =>
    prisma.user.findUnique({
      where: { id },
    }),
  );
}
