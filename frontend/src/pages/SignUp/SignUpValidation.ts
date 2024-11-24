import { SignUpFormData, SignUpFormErrors } from '../../types';
import { checkEmailAvailability } from '../../services/signUpService';

export const validateField = async (
  name: string,
  value: string,
  formData: SignUpFormData,
  formErrors: SignUpFormErrors,
  setFormErrors: React.Dispatch<React.SetStateAction<SignUpFormErrors>>,
) => {
  let error: string | undefined;

  switch (name) {
    case 'email':
      error = await validateEmail(value);
      break;

    case 'firstName':
      error = validateName(value, 'First name');
      break;

    case 'lastName':
      error = validateName(value, 'Last name');
      break;

    case 'password':
      error = validatePassword(value);
      break;

    case 'confirmPassword':
      error = validateConfirmPassword(value, formData.password);
      break;

    default:
      break;
  }

  const newFormErrors: SignUpFormErrors = {
    ...formErrors,
    [name]: error,
  };

  setFormErrors(newFormErrors);

  return newFormErrors;
};

const validateEmail = async (value: string) => {
  if (!value) {
    return 'Email cannot be blank';
  } else if (!value.includes('@')) {
    return 'Invalid email format';
  } else if (value.length > 40) {
    return `Email cannot be more than 40 characters`;
  } else {
    try {
      const isAvailable = await checkEmailAvailability(value);
      if (!isAvailable) {
        return 'Email already in use';
      }
    } catch {
      return 'Error checking email availability';
    }
    return '';
  }
};

const validateName = (value: string, fieldName: string) => {
  if (!value) {
    return `${fieldName} cannot be blank`;
  } else if (value.length > 40) {
    return `${fieldName} cannot be more than 40 characters`;
  } else if (!/^[a-zA-Z'’\- ]+$/.test(value)) {
    return 'Only letters, spaces, hyphens, and apostrophes allowed';
  }
  return '';
};

const validatePassword = (value: string) => {
  if (!value) {
    return 'Password cannot be blank';
  } else if (value.length < 8) {
    return 'Password must be at least 8 characters';
  } else if (!/\d/.test(value)) {
    return 'Password must contain a number';
  } else if (!/[a-zA-Z]/.test(value)) {
    return 'Password must contain both lowercase and uppercase letters';
  } else if (!/[@$!%*?&#]/.test(value)) {
    return 'Password must contain a special character';
  } else if (value.length > 40) {
    return `Email cannot be more than 40 characters`;
  }
  return '';
};

const validateConfirmPassword = (value: string, password: string) => {
  if (value !== password) {
    return 'Passwords do not match';
  }
  return '';
};
