export const validateLogin = (
  name,
  value,
  formData,
  formErrors,
  setFormErrors,
) => {
  let error: string | undefined;

  switch (name) {
    case 'email':
      error = validateEmail(value);
      break;

    case 'password':
      error = validatePassword(value);
      break;
  }

  const newFormErrors = {
    ...formErrors,
    [name]: error,
  };

  setFormErrors(newFormErrors);

  return newFormErrors;
};

const validateEmail = (value: string) => {
  if (!value) {
    return 'Email cannot be blank';
  } else if (!value.includes('@')) {
    return 'Please include valid email';
  }
  return '';
};

const validatePassword = (value: string) => {
  if (!value) {
    return 'Please include password';
  }
  return '';
};

// export const handleAuthError = (error, setFormErrors) => {
//   if (error.message.includes('email')) {
//     setFormErrors((prevErrors) => ({
//       ...prevErrors,
//       emailError: 'Invalid email. Please try again.',
//     }));
//   } else if (error.message.includes('password')) {
//     setFormErrors((prevErrors) => ({
//       ...prevErrors,
//       passwordError: 'Incorrect password. Please try again.',
//     }));
//   } else {
//     setFormErrors((prevErrors) => ({
//       ...prevErrors,
//       passwordError: 'An unexpected error occurred. Please try again later.',
//     }));
//   }
//   console.log(error);
// };
