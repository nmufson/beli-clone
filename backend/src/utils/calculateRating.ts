import * as bookServices from '../services/bookServices';
import { PrismaClient, Prisma, BookStatus, UserReaction } from '@prisma/client';
import { UserBook } from '../types';
import e from 'express';

export async function reorderBooks(
  userId: number,
  newOrderedBooks: number[],
  reaction: UserReaction,
  addedBookId: number,
) {
  console.log('neworder', newOrderedBooks);
  const booksByReaction = await bookServices.getAllBooksByReaction(
    userId,
    reaction,
  );

  const filteredBooks = booksByReaction.filter(
    (book) => book.id !== addedBookId,
  );

  const addedBookIndex = newOrderedBooks.findIndex((id) => id === addedBookId);

  let referenceIndex;
  if (addedBookIndex - 1 >= 0) {
    referenceIndex = addedBookIndex - 1;
  } else {
    referenceIndex = addedBookIndex + 1;
  }

  const referenceBookId = newOrderedBooks[referenceIndex];
  const referenceBookIndex = filteredBooks.findIndex(
    (book) => book.id === referenceBookId,
  );

  const insertionIndex =
    addedBookIndex - 1 >= 0 ? referenceBookIndex + 1 : referenceBookIndex;

  const bookToInsert = booksByReaction.find((book) => book.id === addedBookId);

  if (!bookToInsert) {
    throw new Error(`Book with ID ${addedBookId} not found in booksByReaction`);
  }

  filteredBooks.splice(insertionIndex, 0, bookToInsert);

  const updatedBooks = filteredBooks.map((book, index) => ({
    id: book.id,
    data: { order: index + 1 },
  }));

  const updatedRecords = await bookServices.updateUserBooks(updatedBooks);

  return updatedRecords;

  // if this range has 7 books, assign ratings
  // regardless of how many are in the other ranges
}

export async function calculateRatings(
  userId: number,
  newBookId: number | null,
) {
  const ranges: Record<UserReaction, [number, number]> = {
    DISLIKED: [0, 3.33],
    OKAY: [3.34, 6.66],
    LIKED: [6.67, 10],
  };

  const processReaction = async (reaction: UserReaction) => {
    const books = await bookServices.getAllBooksByReaction(userId, reaction);
    // handles case where reaction category has no books yet
    if (books.length === 0) return;

    const range = ranges[reaction];

    const updatedBooks = books.map((book, index) => ({
      ...book,
      data: {
        autoRating:
          // distribute the books within the range rather than pushing them to the boundaries
          // avoids making one book 6.67 and the other 10, or 0 / 3.33, etc
          range[0] + ((index + 1) / (books.length + 1)) * (range[1] - range[0]),
      },
    }));

    await bookServices.updateUserBooks(updatedBooks);
    return updatedBooks;
  };

  const allUpdatedBooks = (
    await Promise.all(
      (['DISLIKED', 'OKAY', 'LIKED'] as UserReaction[]).map((reaction) =>
        processReaction(reaction),
      ),
    )
  ).flat();

  if (newBookId) {
    const updatedNewBook = allUpdatedBooks.find(
      (book) => book?.id === newBookId,
    );
    return updatedNewBook;
  } else {
    return allUpdatedBooks;
  }
}
