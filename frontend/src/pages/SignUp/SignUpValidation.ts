import { SignUpFormData, SignUpFormErrors } from '../../types';
import { checkEmailAvailability } from '../../services/signUpService';

export const validateField = async (
  name: string,
  value: string,
  formData: SignUpFormData,
  setFormErrors: React.Dispatch<
    React.SetStateAction<Partial<SignUpFormErrors>>
  >,
) => {
  let updatedErrors: Partial<SignUpFormErrors> = {};

  switch (name) {
    case 'email':
      updatedErrors = await validateEmail(value);
      break;

    case 'firstName':
      updatedErrors = validateFirstName(value);
      break;

    case 'lastName':
      updatedErrors = validateLastName(value);
      break;

    case 'password':
      updatedErrors = validatePassword(value);
      break;

    case 'confirmPassword':
      updatedErrors = validateConfirmPassword(value, formData.password);
      break;

    default:
      break;
  }

  setFormErrors((prevErrors: Partial<SignUpFormErrors>) => ({
    ...prevErrors,
    ...updatedErrors,
  }));
};

const validateEmail = async (value: string) => {
  const updatedErrors: Partial<SignUpFormData> = {};

  if (!value) {
    updatedErrors.email = 'Email cannot be blank';
  } else if (!value.includes('@')) {
    updatedErrors.email = 'Invalid email format';
  } else {
    try {
      const isTaken = await checkEmailAvailability(value);
      if (isTaken) {
        updatedErrors.email = 'Email already in use';
      }
    } catch {
      updatedErrors.email = 'Error checking email availability';
    }
  }

  return updatedErrors;
};

const validateFirstName = (value: string) => {
  const updatedErrors: Partial<SignUpFormData> = {};

  if (!value) {
    updatedErrors.firstName = 'First name cannot be blank';
  } else if (value.length > 40) {
    updatedErrors.firstName = 'First name cannot be more than 40 characters';
  } else if (!/^[a-zA-Z'’\- ]+$/.test(value)) {
    updatedErrors.firstName =
      'Only letters, spaces, hyphens, and apostrophes allowed';
  }
  return updatedErrors;
};

const validateLastName = (value: string) => {
  const updatedErrors: Partial<SignUpFormData> = {};

  if (!value) {
    updatedErrors.lastName = 'Last name cannot be blank';
  } else if (value.length > 40) {
    updatedErrors.lastName = 'Last name cannot be more than 40 characters';
  } else if (!/^[a-zA-Z'’\- ]+$/.test(value)) {
    updatedErrors.lastName =
      'Only letters, spaces, hyphens, and apostrophes allowed';
  }
  return updatedErrors;
};

const validatePassword = (value: string) => {
  const updatedErrors: Partial<SignUpFormData> = {};

  if (!value) {
    updatedErrors.password = 'Password cannot be blank';
  } else if (value.length < 8) {
    updatedErrors.password = 'Password must be at least 8 characters';
  } else if (!/\d/.test(value)) {
    updatedErrors.password = 'Password must contain a number';
  } else if (!/[a-zA-Z]/.test(value)) {
    updatedErrors.password =
      'Password must contain both lowercase and uppercase letters';
  } else if (!/[@$!%*?&#]/.test(value)) {
    updatedErrors.password = 'Password must contain a special character';
  }

  return updatedErrors;
};

const validateConfirmPassword = (value: string, password: string) => {
  const updatedErrors: Partial<SignUpFormData> = {};

  if (value !== password) {
    updatedErrors.confirmPassword = 'Passwords do not match';
  }

  return updatedErrors;
};
