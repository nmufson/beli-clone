import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function catchQuery<T>(queryFunction: () => Promise<T>) {
  try {
    return await queryFunction();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export default catchQuery;
