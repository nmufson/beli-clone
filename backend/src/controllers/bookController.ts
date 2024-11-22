import * as bookServices from '../services/bookServices';
import { BookStatus } from '@prisma/client';
import calculateRating from '../utils/calculateRating';

export async function addFinishedBook(req, res) {
  const {
    userId,
    googleBooksId,
    title,
    author,
    genre,
    imageUrl,
    userNote, // could be null depending on status
    userReaction, // could be null depending on status
    status,
  } = req.body;

  // add validation

  const addedBook = await bookServices.addBook({
    userId,
    googleBooksId,
    title,
    author,
    genre,
    imageUrl,
    userNote,
    userReaction,
    autoRating: null, // rating added later
    status,
  });

  const initialRange = {
    disliked: [0, 3.33],
    okay: [3.34, 6.66],
    liked: [6.67, 10],
  }[userReaction];

  const numBooks = 7;

  const comparableBooks = await bookServices.getBookDistribution(
    userId,
    initialRange,
    numBooks,
  );
  if (comparableBooks.length < numBooks) {
    return res.status(201).json({
      message: 'Successfully Added book without rating ',
      addedBook,
    });
  }

  return res.status(201).json({
    message: 'Successfully fetched comparable books',
    addedBook,
    comparableBooks,
  });
}

export async function addBookToShelf(req, res) {
  const { userId, googleBooksId, title, author, genre, imageUrl, status } =
    req.body;

  const addedBook = await bookServices.addBook({
    userId,
    googleBooksId,
    title,
    author,
    genre,
    imageUrl,
    status,
  });

  if (!addedBook) {
    return res
      .status(500)
      .json({ message: 'Book could not be added to shelf' });
  }

  return res.status(201).json({
    message: 'Book successfully added to shelf',
    addedBook,
  });
}

export async function processComparisonResults(req, res) {
  const { userBookId, userReaction, pairwiseResults } = req.body;
  // add validation
  const autoRating = calculateRating(pairwiseResults, userReaction);

  const newBook = await bookServices.updateUserBook({
    userBookId,
    autoRating,
  });

  if (!newBook) {
    return res
      .status(500)
      .json({ message: 'Book not found or could not be updated' });
  }

  return res.status(201).json({
    message: 'New book updated with rating',
    newBook,
  });
}
