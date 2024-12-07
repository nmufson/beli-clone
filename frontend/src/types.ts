export interface SignUpFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}
export interface SignUpFormErrors {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}
export interface SignUpUserFeedback {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface Like {
  id: number;
  userBookId: number | null;
  commentId: number | null;
  userId: number;
}

export interface Comment {
  id: number;
  userBookId: number;
  userId: number;
  content: string;
  createdAt: Date;
}
