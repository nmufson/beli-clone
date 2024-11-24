const API_URL = import.meta.env.VITE_API_URL;
import { SignUpFormData } from '../types';

export const checkEmailAvailability = async (email: string) => {
  const response = await fetch(`${API_URL}/users/check-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to check email availability');
  }

  const data = await response.json();
  return data.available; // bool
};

export const signUpUser = async (formData: SignUpFormData) => {
  const response = await fetch(`${API_URL}/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to sign up user ');
  }

  const newUser = await response.json();

  return newUser;
};
