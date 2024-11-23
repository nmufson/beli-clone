import { UserReaction, BookStatus } from '@prisma/client';

export interface NewUserData {
  email: string;
  hashedPassword: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePictureUrl?: string;
}

export interface AddBookData {
  id: number;
  userId: number;
  googleBooksId: string;
  title: string;
  author: string;
  genre: string;
  imageUrl?: string | null;
  userNote?: string | null;
  autoRating?: number | null;
  userReaction: UserReaction | null;
  status: BookStatus;
}

export interface ShelvedBookData {
  id: number;
  userId: number;
  googleBooksId: string;
  title: string;
  author: string;
  genre: string;
  imageUrl?: string | null;
  status: BookStatus;
}

export interface newBookData {
  id: number;
  userId: number;
  googleBooksId: string;
  title: string;
  author: string;
  genre: string;
  imageUrl?: string;
  userNote?: string | null;
  autoRating?: number | null; // Allow null if no rating is assigned
  userReaction: UserReaction;
  status: BookStatus;
}

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      password: string;
    }
  }
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
