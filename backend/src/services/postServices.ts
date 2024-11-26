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

export async function commentOnPost(
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

// model Like {
//   id         Int       @id @default(autoincrement())
//   postId     Int?
//   commentId  Int?
//   userId     Int

//   post       Post?     @relation(fields: [postId], references: [id], onDelete: Cascade)
//   comment    Comment?  @relation(fields: [commentId], references: [id], onDelete: Cascade)
//   user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
// }

// model Comment {
//   id         Int      @id @default(autoincrement())
//   postId     Int
//   userId     Int
//   content    String
//   createdAt  DateTime @default(now())

//   likes      Like[]
//   post       Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
//   user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
// }
