export interface NewUserData {
  email: string;
  hashedPassword: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePictureUrl?: string;
}

export interface newBookData {
  userId: number;
  googleBooksId: string;
  title: string;
  author: string;
  genre: string;
  imageUrl?: string;
  userNote?: string | null;
  autoRating?: number | null; // Allow null if no rating is assigned
  userReaction?: string | null;
  status: string;
}
