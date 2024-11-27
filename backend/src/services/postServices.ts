import { PrismaClient } from '@prisma/client';
import catchQuery from '../utils/catchQuery';
import { NewPostArgs } from '../types';

const prisma = new PrismaClient();

export async function newPost(data: NewPostArgs) {
  return await catchQuery(() =>
    prisma.post.create({
      data,
    }),
  );
}

export async function getAllPosts() {
  return await catchQuery(async () => {
    return await prisma.post.findMany({
      include: {
        likes: true,
        comments: true,
      },
    });
  });
}

export async function getPostById(postId: number) {
  return await catchQuery(async () => {
    return await prisma.post.findUnique({
      where: { id: postId },
      include: {
        likes: true,
        comments: true,
      },
    });
  });
}

export const getPostsByUserIds = async (userIds: number[]) => {
  return await prisma.post.findMany({
    where: {
      userId: { in: userIds },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      likes: true,
      comments: true,
    },
  });
};

export async function likePost(userId: number, postId: number) {
  return await catchQuery(async () => {
    return await prisma.like.create({
      data: {
        userId,
        postId,
      },
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
  postId: number,
  content: string,
) {
  return await catchQuery(async () => {
    return await prisma.comment.create({
      data: {
        userId,
        postId,
        content,
      },
    });
  });
}
