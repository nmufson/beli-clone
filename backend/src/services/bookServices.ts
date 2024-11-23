import { PrismaClient } from '@prisma/client';
import catchQuery from '../utils/catchQuery';
import { AddBookData, newBookData, ShelvedBookData } from '../types';
import { UserReaction, BookStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function addFinishedBook({
  userId,
  googleBooksId,
  title,
  author,
  genre,
  imageUrl,
  userNote = null,
  autoRating = null,
  userReaction,
  status,
}: Omit<AddBookData, 'id'>): Promise<AddBookData> {
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
        status,
      },
    }),
  );
}

export async function addBookToShelf({
  userId,
  googleBooksId,
  title,
  author,
  genre,
  imageUrl,
  status,
}: Omit<ShelvedBookData, 'id'>): Promise<ShelvedBookData> {
  return await catchQuery(() =>
    prisma.userBook.create({
      data: {
        userId,
        googleBooksId,
        title,
        author,
        genre,
        imageUrl,
        status,
      },
    }),
  );
}

export async function getAllBooksByReaction(
  userId: number,
  userReaction: UserReaction,
) {
  return await catchQuery(() =>
    prisma.userBook.findMany({
      where: {
        userId,
        userReaction,
      },
      orderBy: {
        order: 'asc',
      },
    }),
  );
}

export async function updateBookOrder(
  updatedBooks: { id: number; order: number }[],
) {
  return await Promise.all(
    updatedBooks.map((book) =>
      catchQuery(() =>
        prisma.userBook.update({
          where: { id: book.id },
          data: { order: book.order },
        }),
      ),
    ),
  );
}
// change this to make it by reaction
// add catchQuery to this
export async function getBookDistribution(
  userId: number,
  userReaction: UserReaction,
  numBooks = 7,
  excludedBookId: number,
) {
  const allBooks = await prisma.userBook.findMany({
    where: {
      userId,
      userReaction: userReaction,
      id: {
        not: excludedBookId,
      },
    },
    orderBy: {
      order: 'asc',
    },
  });

  if (allBooks.length <= numBooks) {
    return allBooks;
  }

  const step = Math.floor(allBooks.length / numBooks);

  const distributedBooks = [];
  for (let i = 0; i < numBooks; i++) {
    const groupStart = i * step;
    const groupEnd = i === numBooks - 1 ? allBooks.length : (i + 1) * step;
    const group = allBooks.slice(groupStart, groupEnd);

    if (group.length > 0) {
      const randomIndex = Math.floor(Math.random() * group.length);
      distributedBooks.push(group[randomIndex]);
    }
  }

  return distributedBooks;
}

export async function updateBookRating(userBookId: number, autoRating: number) {
  return await catchQuery(() =>
    prisma.userBook.update({
      where: { id: userBookId },
      data: { autoRating },
    }),
  );
}

export async function updateBookRatings(updatedBooks: Partial<newBookData>[]) {
  return await Promise.all(
    updatedBooks.map((book) =>
      catchQuery(() =>
        prisma.userBook.update({
          where: { id: book.id },
          data: { autoRating: book.autoRating },
        }),
      ),
    ),
  );
}
