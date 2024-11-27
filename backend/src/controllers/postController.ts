import * as postServices from '../services/postServices';
import * as userServices from '../services/userServices';
import { Request, Response, NextFunction } from 'express';

export const getAllPosts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const posts = await postServices.getAllPosts();

  if (!posts) {
    res.status(500).json({ message: 'Failed to retrieve posts' });
  }

  res.status(200).json({ message: 'Post retrieved successfully', posts });
};

export const getUserFeedPosts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.id;

  let posts;
  if (userId) {
    const following = await userServices.getUsersUserFollowing(userId);
    const followingIds = following?.map((follow) => follow.id);

    if (followingIds) {
      posts = await postServices.getPostsByUserIds(followingIds);
    }
  }

  if (!posts) {
    res.status(500).json({ message: 'Failed to retrieve posts' });
  }

  res.status(200).json({ message: 'Posts retrieved successfully', posts });
};

// users can view post if there are comments on it
export const getPost = async (req: Request, res: Response): Promise<void> => {
  const { postIdParam } = req.params;
  const postId = parseInt(postIdParam);

  const post = await postServices.getPostById(postId);

  if (!postId) {
    res.status(500).json({ message: 'Failed to retrieve post' });
  }

  res.status(200).json({ message: 'Post retrieved successfully', post });
};

export const likePost = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body;
  const { postIdParam } = req.params;
  const postId = parseInt(postIdParam);

  const newLike = await postServices.likePost(userId, postId);

  if (!newLike) {
    res.status(500).json({ message: 'Failed to add like to post' });
  }

  res.status(201).json({ message: 'Like added to post successfully', newLike });
};

export const likeComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = req.body;

  const { commentIdParam } = req.params;
  const commentId = parseInt(commentIdParam);

  const newLike = await postServices.likeComment(userId, commentId);

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

  const { postIdParam } = req.params;
  const postId = parseInt(postIdParam);

  const newComment = await postServices.newComment(userId, postId, content);

  if (!newComment) {
    res.status(500).json({ message: 'Failed to comment to post' });
  }

  res
    .status(201)
    .json({ message: 'Comment added to post successfully', newComment });
};
