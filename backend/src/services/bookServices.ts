import { BookStatus, PrismaClient, UserReaction } from '@prisma/client';
import catchQuery from '../utils/catchQuery';
import { UserBook, AddFinishedBookArgs, addBookToShelfArgs } from '../types';

const prisma = new PrismaClient();

export async function addFinishedBook(
  data: AddFinishedBookArgs,
): Promise<Omit<UserBook, 'user'>> {
  return await catchQuery(() =>
    prisma.userBook.create({
      data: {
        ...data,
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
  hasPost,
}: addBookToShelfArgs): Promise<Omit<UserBook, 'user'>> {
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
        hasPost,
      },
    }),
  );
}

export async function getAllBooksByReaction(
  userId: number,
  userReaction: UserReaction,
): Promise<Omit<UserBook, 'user'>[]> {
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

export async function updateUserBooks(
  updatedBooks: { id: number; data: Partial<Omit<UserBook, 'user'>> }[],
) {
  return await Promise.all(
    updatedBooks.map((book) =>
      catchQuery(() =>
        prisma.userBook.update({
          where: { id: book.id },
          data: book.data,
        }),
      ),
    ),
  );
}

export async function updateUserBook(
  userBookId: number,
  data: Partial<Omit<UserBook, 'user'>>,
) {
  return await catchQuery(() =>
    prisma.userBook.update({
      where: { id: userBookId },
      data,
    }),
  );
}

export async function deleteUserBook(userBookId: number) {
  return await catchQuery(() =>
    prisma.userBook.delete({
      where: { id: userBookId },
    }),
  );
}

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

export async function getAllUserBooksByUserId(userId: number | undefined) {
  return await catchQuery(() =>
    prisma.userBook.findMany({
      where: {
        userId,
      },
      orderBy: {
        order: 'asc',
      },
    }),
  );
}

export async function getAllBooksWithUserPreviews() {
  return await catchQuery(() =>
    prisma.userBook.findMany({
      include: {
        likes: true,
        comments: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
  );
}

export const getUserFeedBooksWithUserPreviews = async (
  followingIds: number[],
) => {
  return await prisma.userBook.findMany({
    where: {
      userId: { in: followingIds },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      likes: true,
      comments: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePictureUrl: true,
        },
      },
    },
  });
};

export async function getUserBookById(postId: number) {
  return await catchQuery(async () => {
    return await prisma.userBook.findUnique({
      where: { id: postId },
      include: {
        likes: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                profilePictureUrl: true,
              },
            },
            likes: true,
          },
        },
      },
    });
  });
}

export async function likeUserBook(userId: number, userBookId: number) {
  return await catchQuery(async () => {
    return await prisma.like.create({
      data: {
        userId,
        userBookId,
      },
    });
  });
}

export async function deleteLike(likeId: number) {
  return await catchQuery(async () => {
    return await prisma.like.delete({
      where: { id: likeId },
    });
  });
}

export async function likeComment(userId: number, commentId: number) {
  return await catchQuery(async () => {
    return await prisma.like.create({
      data: {
        userId,
        commentId,
      },
    });
  });
}

export async function newComment(
  userId: number,
  userBookId: number,
  content: string,
) {
  return await catchQuery(async () => {
    return await prisma.comment.create({
      data: {
        userId,
        userBookId,
        content,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
          },
        },
        likes: true,
      },
    });
  });
}

export async function getBookLikes(userBookId: number) {
  return await catchQuery(async () => {
    return await prisma.like.findMany({
      where: { userBookId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
          },
        },
      },
    });
  });
}

export async function getCommentLikes(commentId: number) {
  return await catchQuery(async () => {
    return await prisma.like.findMany({
      where: { commentId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
          },
        },
      },
    });
  });
}

export async function getBookComments(userBookId: number) {
  return await catchQuery(async () => {
    return await prisma.comment.findMany({
      where: { userBookId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
          },
        },
      },
    });
  });
}
