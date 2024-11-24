import * as bookServices from '../services/bookServices';
import { PrismaClient, Prisma, BookStatus, UserReaction } from '@prisma/client';
import { reorderBooks, calculateRatings } from '../utils/calculateRating';
import { Request, Response, NextFunction } from 'express';

export const addFinishedBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    userId,
    googleBooksId,
    title,
    author,
    genre,
    imageUrl,
    userNote,
    userReaction,
    // status,
  } = req.body;

  // update this
  if (
    !userId ||
    !googleBooksId ||
    !title ||
    !author ||
    !genre ||
    !userReaction ||
    !status
  ) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const addedBook = await bookServices.addFinishedBook({
    userId,
    googleBooksId,
    title,
    author,
    genre,
    imageUrl: imageUrl || null,
    userNote: userNote || null,
    userReaction: userReaction,
    status: BookStatus.FINISHED,
  });

  const numBooks = 7;

  const comparableBooks = await bookServices.getBookDistribution(
    userId,
    userReaction,
    numBooks,
    addedBook.id,
  );
  if (comparableBooks.length === 0) {
    res.status(201).json({
      message: 'Successfully added first book in range ',
      addedBook,
    });
    return;
  }

  res.status(201).json({
    message: 'Successfully fetched comparable books',
    addedBook,
    comparableBooks,
  });
  return;
};

export async function processComparisonResults(req: Request, res: Response) {
  const { userId, newBookId, reaction, pairwiseResults } = req.body;
  // add validation

  const updatedBooks = await reorderBooks(userId, pairwiseResults, reaction);

  if (updatedBooks.length > 4) {
    const updatedNewBook = calculateRatings(userId, newBookId);

    if (!updatedNewBook) {
      return res
        .status(500)
        .json({ message: 'Book not found or could not be updated' });
    }

    return res.status(201).json({
      message: 'New book updated with rating',
      updatedNewBook,
    });
  }
  return res.status(201).json({
    message: 'Books reordered successfully',
    updatedBooks,
  });
}

export const addBookToShelf = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId, googleBooksId, title, author, genre, imageUrl, status } =
    req.body;

  const addedBook = await bookServices.addBookToShelf({
    userId,
    googleBooksId,
    title,
    author,
    genre,
    imageUrl,
    status,
  });

  if (!addedBook) {
    res.status(500).json({ message: 'Book could not be added to shelf' });
    return;
  }

  res.status(201).json({
    message: 'Book successfully added to shelf',
    addedBook,
  });
  return;
};
