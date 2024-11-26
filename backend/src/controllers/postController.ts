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
    const following = await userServices.getUserWithFollowing(userId);
    const followingIds = following.map((follow) => follow.followerId);

    posts = await postServices.getPostsByUserIds(followingIds);
  }

  if (!posts) {
    res.status(500).json({ message: 'Failed to retrieve posts' });
  }

  res.status(200).json({ message: 'Posts retrieved successfully', posts });
};

// users can view post if there are comments on it
export const viewPost = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const likePost = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const commentOnPost = async (
  req: Request,
  res: Response,
): Promise<void> => {};
