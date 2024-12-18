import {
  PrismaClient,
  Prisma,
  BookStatus,
  UserReaction,
  followRequestStatus,
} from '@prisma/client';
const prisma = new PrismaClient();

// type BookStatus = Prisma.$Enums.BookStatus;
// type UserReaction = Prisma.$Enums.UserReaction;

export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  profilePictureUrl: string | null;
  createdAt: Date;
  books: UserBook[];
  followers: UserFollower[];
  following: UserFollower[];
  followRequestsSent: FollowRequest[];
  followRequestsReceived: FollowRequest[];
  likes: Like[];
  comments: Comment[];
}

export type UserWithoutRelations = Omit<
  User,
  | 'books'
  | 'followers'
  | 'following'
  | 'followRequestsSent'
  | 'followRequestsReceived'
  | 'comparisons'
  | 'likes'
  | 'comments'
>;

export interface UserMinimal {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface NewUser {
  email: string;
  hashedPassword: string;
  firstName: string;
  lastName: string;
}

export interface UserFollower {
  userId: number;
  followerId: number;
  user: User;
  follower: User;
}

export interface FollowRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  sender: User;
  receiver: User;
}

export interface AddFinishedBookArgs {
  userId: number;
  googleBooksId: string;
  title: string;
  author: string;
  genre: string;
  imageUrl: string | null;
  userNote: string | null;
  userReaction: UserReaction | null;
  status: BookStatus;
}

export interface AddBookSeed {
  userId: number;
  googleBooksId: string;
  title: string;
  author: string;
  genre: string;
  imageUrl: string | null;
  userNote: string | null;
  order: number;
  userReaction: UserReaction | null;
  status: BookStatus;
}

export interface UserBook {
  id: number;
  userId: number;
  googleBooksId: string;
  title: string;
  author: string;
  genre: string;
  imageUrl: string | null;
  userReaction: UserReaction | null;
  order: number | null;
  autoRating: number | null;
  userNote: string | null;
  status: BookStatus;
  createdAt: Date;
  user: User;
}

export interface addBookToShelfArgs {
  userId: number;
  googleBooksId: string;
  title: string;
  author: string;
  genre: string;
  imageUrl: string;
  status: BookStatus;
  hasPost: boolean;
}

export type UserBookWithoutRelations = Omit<
  UserBook,
  | 'books'
  | 'followers'
  | 'following'
  | 'followRequestsSent'
  | 'followRequestsReceived'
  | 'comparisons'
  | 'likes'
  | 'comments'
>;

export interface Like {
  id: number;
  postId: number | null;
  commentId: number | null;
  userId: number;
  userBook: UserBook | null;
  comment: Comment | null;
  user: User;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: Date;
  likes: Like[];
  userBook: UserBook;
  user: User;
}

export interface AuthInfo {
  message: string;
  // [key: string]: any;
}

export interface FooterInfo {
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
}

//

declare global {
  namespace Express {
    interface User {
      id: number;
    }
  }
}
