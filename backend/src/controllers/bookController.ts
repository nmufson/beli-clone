import * as bookServices from '../services/bookServices';
import calculateRating from '../utils/calculateRating';

export async function startAddUserBook(req, res) {
  const {
    userId,
    googleBooksId,
    title,
    author,
    genre,
    imageUrl,
    userNote,
    userReaction,
  } = req.body;

  // add validation

  const initialRange = {
    disliked: [0, 3.33],
    okay: [3.34, 6.66],
    liked: [6.67, 10],
  }[userReaction];

  const numOfBooks = 7;

  const comparableBooks = await bookServices.getBooksInRange(
    userId,
    initialRange,
    genre,
    numOfBooks,
  );

  const newBook = await bookServices.newUserBook({
    userId,
    googleBooksId,
    title,
    author,
    genre,
    imageUrl,
    userNote,
    userReaction,
    autoRating: null, // rating added later
  });

  if (comparableBooks.length < numOfBooks) {
    return res.status(201).json({
      message: 'Successfully Added book without rating ',
      newBook,
    });
  }

  return res.status(201).json({
    message: 'Successfully fetched comparable books',
    newBook,
    comparableBooks,
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
