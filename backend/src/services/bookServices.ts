import { PrismaClient } from '@prisma/client';
import catchQuery from '../utils/catchQuery';
import { newBookData } from '../types';

const prisma = new PrismaClient();

export async function newUserBook({
  userId,
  googleBooksId,
  title,
  author,
  genre,
  imageUrl,
  userNote,
  autoRating = null,
  userReaction,
}: newBookData) {
  return await catchQuery(() =>
    prisma.userBook.create({
      data: {
        userId,
        googleBooksId,
        title,
        author,
        genre,
        imageUrl,
        userNote,
        autoRating,
        userReaction,
      },
    }),
  );
}

// add catchQuery to this
export async function getBooksInRange(
  userId: number,
  range: [number, number],
  genre: string,
  numBooks = 7,
) {
  let books = await prisma.userBook.findMany({
    where: {
      userId,
      autoRating: {
        gte: range[0],
        lte: range[1],
      },
      genre,
    },
    take: numBooks,
  });

  if (books.length < 3) {
    const additionalBooks = await prisma.userBook.findMany({
      where: {
        userId,
        autoRating: {
          gte: range[0],
          lte: range[1],
        },
        id: {
          notIn: books.map((book) => book.id),
        },
      },
      orderBy: {
        autoRating: 'asc',
      },
      take: numBooks - books.length,
    });

    books = [...books, ...additionalBooks];
  }

  return books;
}

export async function updateBookRating(userBookId: number, autoRating: number) {
  return await catchQuery(() =>
    prisma.userBook.update({
      where: { id: userBookId },
      data: { autoRating },
    }),
  );
}
