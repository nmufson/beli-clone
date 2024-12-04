import * as bookServices from '../services/bookServices';
import * as userServices from '../services/userServices';
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
  } = req.body;

  // update this
  if (
    !userId ||
    !googleBooksId ||
    !title ||
    !author ||
    !genre ||
    !userReaction
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
    imageUrl: imageUrl || undefined,
    userNote: userNote || undefined,
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
    hasPost,
  } = req.body;

  const addedBook = await bookServices.addBookToShelf({
    userId,
    googleBooksId,
    title,
    author,
    genre,
    imageUrl,
    status,
    hasPost,
  });

  if (!addedBook) {
    res.status(500).json({ message: 'Book could not be added to shelf' });
    return;
  }

  res.status(201).json({
    message: 'Book successfully added to shelf',
    addedBook,
  });
};

export const getAllUserBooksByUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // const userId = req.user?.id;

  const { userIdParam } = req.params;
  const userId = parseInt(userIdParam);

  const userBooks = await bookServices.getAllUserBooksByUserId(userId);

  if (!userBooks) {
    res.status(500).json({ message: 'Books could not be retrieved' });
  }

  res.status(200).json({
    message: 'Books retrieved successfully',
    userBooks,
  });
};

export const getGuestFeedUserBooks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userBooks = await bookServices.getAllBooksWithUserPreviews();

  if (!userBooks) {
    res.status(500).json({ message: 'Failed to retrieve user books' });
  }

  res.status(200).json({
    message: 'User books retrieved successfully',
    userBooks,
    isLoggedIn: false,
  });
};

export const getUserFeedUserBooks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.id;

  let userBooks;
  if (userId) {
    const following = await userServices.getUsersUserFollowing(userId);
    const followingIds = following?.map((follow) => follow.id);

    if (followingIds) {
      userBooks =
        await bookServices.getUserFeedBooksWithUserPreviews(followingIds);
    }
  }

  if (!userBooks) {
    res.status(500).json({ message: 'Failed to retrieve user books' });
  }

  const userBooksWithLikeInfo = userBooks?.map((book) => {
    const userLike = book.likes.find((like) => like.userId === req.user?.id);
    const userLikeId = userLike ? userLike.id : null;

    return {
      ...book,
      userLikeId,
    };
  });

  res.status(200).json({
    message: 'User books retrieved successfully',
    userBooks: userBooksWithLikeInfo,
    isLoggedIn: true,
  });
};

// users can only view post if there are comments on it
// will prevent users from clicking on frontend
// redirect from backend if they somehow access
export const getUserBook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userBookIdParam } = req.params;
  const userBookId = parseInt(userBookIdParam);

  const userBook = await bookServices.getUserBookById(userBookId);

  console.log(userBook);
  if (!userBook) {
    res.status(500).json({ message: 'Failed to retrieve user book' });
  }

  const userLike = userBook?.likes.find((like) => like.userId === req.user?.id);
  const userLikeId = userLike ? userLike.id : null;

  const userBookWithLikeInfo = { ...userBook, userLikeId };

  res.status(200).json({
    message: 'User book retrieved successfully',
    userBook: userBookWithLikeInfo,
    isLoggedIn: Boolean(req.user),
  });
};

export const likeUserBook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.id;
  const { userBookIdParam } = req.params;
  const userBookId = parseInt(userBookIdParam);

  let newLike;
  if (userId) {
    newLike = await bookServices.likeUserBook(userId, userBookId);
  }

  if (!newLike) {
    res.status(500).json({ message: 'Failed to add like to user book' });
  }

  res
    .status(201)
    .json({ message: 'Like added to user book successfully', newLike });
};

export const deleteLike = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { likeIdParam } = req.params;
  const likeId = parseInt(likeIdParam);

  const deletedLike = await bookServices.deleteLike(likeId);

  if (!deletedLike) {
    res.status(404).json({ error: 'Like not found' });
    return;
  }

  res.status(204).send();
};

export const likeComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = req.body;

  const { commentIdParam } = req.params;
  const commentId = parseInt(commentIdParam);

  const newLike = await bookServices.likeComment(userId, commentId);

  if (!newLike) {
    res.status(500).json({ message: 'Failed to add like to comment' });
  }

  res
    .status(201)
    .json({ message: 'Like added to comment successfully', newLike });
};

export const commentOnPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId, content } = req.body;

  const { userBookIdParam } = req.params;
  const userBookId = parseInt(userBookIdParam);

  const newComment = await bookServices.newComment(userId, userBookId, content);

  if (!newComment) {
    res.status(500).json({ message: 'Failed to comment on user book' });
  }

  res
    .status(201)
    .json({ message: 'Comment added to user book successfully', newComment });
};

export const getUserBookLikes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userBookIdParam } = req.params;
  const userBookId = parseInt(userBookIdParam);

  const userBookLikes = await bookServices.getBookLikes(userBookId);

  if (!userBookLikes) {
    res.status(500).json({ message: 'Failed to retrieve user book likes' });
  }

  res
    .status(200)
    .json({ message: 'User book likes retrieved successfully', userBookLikes });
};

export const getUserBookComments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userBookIdParam } = req.params;
  const userBookId = parseInt(userBookIdParam);

  const comments = await bookServices.getBookComments(userBookId);

  if (!comments) {
    res.status(500).json({ message: 'Failed to retrieve commnents' });
  }

  res
    .status(200)
    .json({ message: 'Comments retrieved successfully', comments });
};

export const getCommentLikes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { commentIdParam } = req.params;
  const commentId = parseInt(commentIdParam);

  const commentLikes = await bookServices.getCommentLikes(commentId);

  if (!commentLikes) {
    res.status(500).json({ message: 'Failed to retrieve comment likes' });
  }

  res
    .status(200)
    .json({ message: 'Comment likes retrieved successfully', commentLikes });
};
