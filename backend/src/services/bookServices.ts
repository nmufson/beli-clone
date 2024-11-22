import { PrismaClient, BookStatus } from '@prisma/client';
import catchQuery from '../utils/catchQuery';
import { newBookData } from '../types';

const prisma = new PrismaClient();

export async function addBook({
  userId,
  googleBooksId,
  title,
  author,
  genre,
  imageUrl,
  userNote = null,
  autoRating = null,
  userReaction = null,
  status,
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
        status,
      },
    }),
  );
}

export async function getAllBooksInRange(
  userId: number,
  range: [number, number],
) {
  return await catchQuery(() =>
    prisma.userBook.findMany({
      where: {
        userId,
        autoRating: {
          gte: range[0],
          lte: range[1],
        },
      },
      orderBy: {
        autoRating: 'asc',
      },
    }),
  );
}

// add catchQuery to this
export async function getBookDistribution(
  userId: number,
  range: [number, number],
  numBooks = 7,
) {
  const step = (range[1] - range[0]) / numBooks; // Divide the range into subranges
  const books: any[] = [];

  for (let i = 0; i < numBooks; i++) {
    const subRangeStart = range[0] + i * step;
    const subRangeEnd = subRangeStart + step;

    // findFirst takes one book
    const book = await prisma.userBook.findFirst({
      where: {
        userId,
        autoRating: {
          gte: subRangeStart,
          lte: subRangeEnd,
        },
      },
      orderBy: {
        autoRating: 'asc',
      },
    });

    if (book) {
      books.push(book);
    }
  }

  const totalBooksInRange = await prisma.userBook.count({
    where: {
      userId,
      autoRating: {
        gte: range[0],
        lte: range[1],
      },
    },
  });

  if (books.length < numBooks) {
    const remainingBooksInRange = totalBooksInRange - books.length;
    const randomSkip = Math.floor(Math.random() * remainingBooksInRange);

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
      skip: randomSkip,
      // offset starting point of query
    });

    books.push(...additionalBooks);
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

export async function updateBookRatings(
  userBooks: { userBookId: number; autoRating: number }[],
) {
  return await Promise.all(
    userBooks.map((book) =>
      catchQuery(() =>
        prisma.userBook.update({
          where: { id: book.userBookId },
          data: { autoRating: book.autoRating },
        }),
      ),
    ),
  );
}
