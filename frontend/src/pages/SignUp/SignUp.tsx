import styles from './SignUp.module.css';
import LabelInput from '../../components/LabelInput/LabelInput';
import DOMPurify from 'dompurify';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  SignUpFormData,
  SignUpFormErrors,
  SignUpUserFeedback,
} from '../../types';
import { signUpUser } from '../../services/signUpService';
import { validateField } from './SignUpValidation';

const SignUp = () => {
  // modulate this to custom hook?
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<SignUpFormErrors>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [userFeedback, setUserFeedback] = useState<SignUpUserFeedback>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as {
      name: keyof SignUpFormErrors;
      value: string;
    };

    const sanitizedValue = DOMPurify.sanitize(value.trim());

    setFormData((prevData) => ({
      ...prevData,
      [name]: sanitizedValue,
    }));
    const newFormErrors = await validateField(
      name,
      sanitizedValue,
      { ...formData, [name]: sanitizedValue },
      formErrors,
      setFormErrors,
    );
    const hasErrors = Object.values(newFormErrors).some(
      (error) => error !== '',
    );
    const isFilledOut = Object.values(formData).every((value) => value !== '');
    setSubmitDisabled(hasErrors || !isFilledOut);

    if (!newFormErrors[name]) {
      setUserFeedback((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target as { name: keyof SignUpFormErrors };

    validateField(name, formData[name], formData, formErrors, setFormErrors);
    setUserFeedback((prev) => ({
      ...prev,
      [name]: formErrors[name] || '',
    }));
  };

  const handleSubmit = async (e) => {
    try {
      const newUser = await signUpUser(formData);
      window.location.href = '/feed';
      // redirect to feed, window location
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <LabelInput
          label="Email"
          name="email"
          value={formData.email}
          placeholder="Email"
          type="email"
          maxLength={40}
          onChange={handleChange}
          onBlur={handleBlur}
          userFeedback={userFeedback.email}
        />
        <LabelInput
          label="First Name"
          name="firstName"
          value={formData.firstName}
          placeholder="First name"
          type="text"
          maxLength={40}
          onChange={handleChange}
          onBlur={handleBlur}
          userFeedback={userFeedback.firstName}
        />
        <LabelInput
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          placeholder="Last name"
          type="text"
          maxLength={40}
          onChange={handleChange}
          onBlur={handleBlur}
          userFeedback={userFeedback.lastName}
        />
        <LabelInput
          label="Password"
          name="password"
          value={formData.password}
          placeholder="Password"
          type="password"
          maxLength={40}
          onChange={handleChange}
          onBlur={handleBlur}
          userFeedback={userFeedback.password}
        />
        <LabelInput
          label="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          placeholder="Confirm password"
          type="password"
          maxLength={40}
          onChange={handleChange}
          onBlur={handleBlur}
          userFeedback={userFeedback.confirmPassword}
        />
      </div>
      <div>
        <button
          className={submitDisabled ? styles.disabled : ''}
          disabled={submitDisabled}
          onClick={handleSubmit}
        >
          Sign Up
        </button>
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
