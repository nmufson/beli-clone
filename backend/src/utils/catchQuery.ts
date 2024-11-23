import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function catchQuery<T>(queryFunction: () => Promise<T>) {
  try {
    return await queryFunction();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
}

export default catchQuery;
