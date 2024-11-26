import { PrismaClient, Prisma, BookStatus, UserReaction } from '@prisma/client';
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
  updatedAt: Date;
  books: UserBook[];
  posts: Post[];
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
  | 'posts'
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
  updatedAt: Date | null;
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
}

export type UserBookWithoutRelations = Omit<
  UserBook,
  | 'books'
  | 'posts'
  | 'followers'
  | 'following'
  | 'followRequestsSent'
  | 'followRequestsReceived'
  | 'comparisons'
  | 'likes'
  | 'comments'
>;

export interface Post {
  id: number;
  userId: number;
  googleBooksId: string;
  bookName: string;
  bookAuthor: string;
  userRating: number;
  userNote: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  likes: Like[];
  comments: Comment[];
}

export interface Like {
  id: number;
  postId: number | null;
  commentId: number | null;
  userId: number;
  post: Post | null;
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
  post: Post;
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

export interface NewPostArgs {
  userId: number;
  googleBooksId: string;
  bookName: string;
  bookAuthor: string;
  bookImageUrl: string;
  userRating: number | undefined;
  userNote: string | undefined;
  status: BookStatus;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  userBookId: number;
}
