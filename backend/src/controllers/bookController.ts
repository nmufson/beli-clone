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
  const userId = req.user?.id;
  const { bookData, userNote, userReaction } = req.body;

  const { googleBooksId, title, author, genre, imageUrl } = bookData;

  console.log(userNote, userReaction);
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

  console.log(userReaction);
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
  const userId = req.user?.id;
  const { addedBookId, reaction, newOrderedBooks } = req.body;
  // add validation

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const updatedBooks = await reorderBooks(
    userId,
    newOrderedBooks,
    reaction,
    addedBookId,
  );

  if (updatedBooks.length > 4) {
    const updatedNewBook = calculateRatings(userId, addedBookId);

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
  const { bookData, status } = req.body;

  const { googleBooksId, title, author, genre, imageUrl, hasPost } = bookData;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

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

export const updateShelf = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { userBookIdParam } = req.params;
  const userBookId = parseInt(userBookIdParam);

  // add reaction here
  const { oldStatus, newStatus, userReaction } = req.body;
  console.log(newStatus);

  if (!Object.values(BookStatus).includes(newStatus)) {
    res.status(400).json({ message: 'Invalid book status' });
    return;
  }
  let updatedUserBook;

  if (newStatus === 'FINISHED') {
    updatedUserBook = await bookServices.updateUserBook(userBookId, {
      status: newStatus as BookStatus,
      userReaction,
    });

    const numBooks = 7;

    const comparableBooks = await bookServices.getBookDistribution(
      userId,
      userReaction,
      numBooks,
      updatedUserBook.id,
    );
    if (comparableBooks.length === 0) {
      res.status(201).json({
        message: 'Successfully added first book in range ',
        updatedUserBook,
      });
      return;
    }

    res.status(201).json({
      message: 'Successfully fetched comparable books',
      updatedUserBook,
      comparableBooks,
    });
    return;
  } else {
    if (oldStatus === 'FINISHED') {
      updatedUserBook = await bookServices.updateUserBook(userBookId, {
        status: newStatus as BookStatus,
        autoRating: null,
        order: null,
        userReaction: null,
      });
    } else {
      updatedUserBook = await bookServices.updateUserBook(userBookId, {
        status: newStatus as BookStatus,
      });
    }
    res.status(200).json({
      message: 'Book status updated successfully',
      updatedUserBook,
    });
  }
};

export const removeFromShelf = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userBookIdParam } = req.params;
  const userBookId = parseInt(userBookIdParam);

  const removedBook = await bookServices.deleteUserBook(userBookId);

  if (!removedBook) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }

  res.status(200).json({
    message: 'Book successfully removed from shelf',
    removedBook,
  });
};

export const getAllUserBooksByUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // switch this back to req.user
  //
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
  const feedBooks = await bookServices.getAllBooksWithUserPreviews();

  if (!feedBooks) {
    res.status(500).json({ message: 'Failed to retrieve user books' });
  }

  res.status(200).json({
    message: 'Guest feed user books retrieved successfully',
    feedBooks,
  });
};

// perhaps do some of this processing and manipulation in one query??
export const getUserFeedUserBooks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.id;

  let feedBooks;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const following = await userServices.getUsersUserFollowing(userId);
  const followingIds = following?.map((follow) => follow.id);

  if (!followingIds || followingIds.length === 0) {
    res.status(200).json({ message: 'No following users', feedBooks: [] });
    return;
  }

  feedBooks = await bookServices.getUserFeedBooksWithUserPreviews(followingIds);

  if (!feedBooks) {
    res.status(500).json({ message: 'Failed to retrieve user books' });
    return;
  }

  const loggedInUserBooks = await bookServices.getAllUserBooksByUserId(userId);

  const loggedInUserBooksMap = new Map(
    loggedInUserBooks.map((book) => [
      book.googleBooksId,
      { id: book.id, status: book.status },
    ]),
  );
  const enhancedFeedBooks = feedBooks.map((book) => {
    const userLike = book.likes.find((like) => like.userId === userId);

    const commonBookInfo = loggedInUserBooksMap.get(book.googleBooksId) || null;

    return {
      ...book,
      userLikeId: userLike ? userLike.id : null,
      loggedInUserBookStatus: commonBookInfo?.status || null,
      loggedInUserBookId: commonBookInfo?.id || null,
    };
  });

  res.status(200).json({
    message: 'User feed user books retrieved successfully',
    feedBooks: enhancedFeedBooks,
  });
};

// users can only view post if there are comments on it
// will prevent users from clicking on frontend
// redirect from backend if they somehow access
export const getUserBook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.id;
  const { userBookIdParam } = req.params;
  const userBookId = parseInt(userBookIdParam);

  const userBook = await bookServices.getUserBookById(userBookId);

  if (!userBook) {
    res.status(500).json({ message: 'Failed to retrieve user book' });
    return;
  }

  const userLike = userBook?.likes.find((like) => like.userId === req.user?.id);
  const userLikeId = userLike ? userLike.id : null;

  const loggedInUserBooks = await bookServices.getAllUserBooksByUserId(userId);
  const commonBook = loggedInUserBooks.find(
    (book) => book.googleBooksId === userBook.googleBooksId,
  );
  const loggedInUserBookStatus = commonBook?.status || null;
  const loggedInUserBookId = commonBook?.id || null;

  const commentsWithLikeInfo = userBook.comments.map((comment) => {
    const userCommentLike = comment.likes.find(
      (like) => like.userId === userId,
    );
    const userCommentLikeId = userCommentLike ? userCommentLike.id : null;

    return {
      ...comment,
      userCommentLikeId,
    };
  });

  const userBookWithLikeInfo = {
    ...userBook,
    userLikeId,
    loggedInUserBookStatus,
    loggedInUserBookId,
    comments: commentsWithLikeInfo,
  };

  res.status(200).json({
    message: 'User book retrieved successfully',
    userBook: userBookWithLikeInfo,
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
  const userId = req.user?.id;

  const { commentIdParam } = req.params;
  const commentId = parseInt(commentIdParam);

  let newLike;
  if (userId) {
    newLike = await bookServices.likeComment(userId, commentId);
  }

  if (!newLike) {
    res.status(500).json({ message: 'Failed to add like to comment' });
    return;
  }

  res
    .status(201)
    .json({ message: 'Like added to comment successfully', newLike });
};

export const commentOnPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.id;
  const { content } = req.body;

  const { userBookIdParam } = req.params;
  const userBookId = parseInt(userBookIdParam);

  let newComment;
  if (userId) {
    newComment = await bookServices.newComment(userId, userBookId, content);
  }

  if (!newComment) {
    res.status(500).json({ message: 'Failed to comment on user book' });
    return;
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
    return;
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
    return;
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
    return;
  }

  res
    .status(200)
    .json({ message: 'Comment likes retrieved successfully', commentLikes });
};
