import * as bookServices from '../services/bookServices';
import * as postServices from '../services/postServices';
import { BookStatus } from '@prisma/client';
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
    const newPost = await postServices.newPost({
      userId,
      googleBooksId,
      bookName: title,
      bookAuthor: author,
      bookImageUrl: imageUrl,
      userRating: undefined,
      userNote: userNote || null,
      status: BookStatus.FINISHED,
      createdAt: undefined,
      updatedAt: undefined,
      userBookId: addedBook.id,
    });

    res.status(201).json({
      message: 'Successfully added first book in range ',
      addedBook,
      newPost,
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

export const processComparisonResults = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { userId, newBookId, reaction, pairwiseResults } = req.body;
  // add validation

  const updatedBooks = await reorderBooks(userId, pairwiseResults, reaction);

  if (updatedBooks.length > 4) {
    const updatedNewBook = calculateRatings(userId, newBookId);

    if (!updatedNewBook) {
      res
        .status(500)
        .json({ message: 'Book not found or could not be updated' });
      return;
    }

    res.status(201).json({
      message: 'New book updated with rating',
      updatedNewBook,
    });
    return;
  }
  res.status(201).json({
    message: 'Books reordered successfully',
    updatedBooks,
  });
  return;
};

export const addBookToShelf = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {
    userId,
    googleBooksId,
    title,
    author,
    genre,
    imageUrl,
    status,
    makePost,
  } = req.body;

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

  let newPost;
  if (makePost) {
    newPost = await postServices.newPost({
      userId,
      googleBooksId,
      bookName: title,
      bookAuthor: author,
      bookImageUrl: imageUrl,
      userRating: undefined,
      userNote: undefined,
      status,
      createdAt: undefined,
      updatedAt: undefined,
      userBookId: addedBook.id,
    });

    if (!newPost) {
      res.status(500).json({ message: 'Post could not be made' });
      return;
    }

    res.status(201).json({
      message: 'Book successfully added to shelf',
      addedBook,
      newPost,
    });
  }
};

export const getAllUserBooks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.id;

  const userBooks = await bookServices.getAllBooksByUserId(userId);

  if (!userBooks) {
    res.status(500).json({ message: 'Books could not be retrieved' });
  }

  res.status(200).json({
    message: 'Books retrieved successfully',
    userBooks,
  });
};
