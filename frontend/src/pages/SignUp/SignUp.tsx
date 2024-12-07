import styles from './SignUp.module.css';
import LabelInput from '../../components/LabelInput/LabelInput';
import DOMPurify from 'dompurify';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { SignUpFormData, SignUpFormErrors } from '../../types';
import { signUpUser } from '../../services/signUpService';
import { validateField } from './SignUpValidation';
import useAuth from '../../hooks/useAuth';

const SignUp = () => {
  // modulate this to custom hook?

  const { isAuthenticated, loading } = useOutletContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed/user');
    }
  }, [isAuthenticated, navigate]);

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
  };

  const handleBlur = (e) => {
    const { name } = e.target as { name: keyof SignUpFormErrors };

    validateField(name, formData[name], formData, formErrors, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = await signUpUser(formData);
      console.log(newUser);

      window.location.href = '/feed/user';
    } catch (error) {
      console.log(error);
    }
  };

  //make this a component
  if (loading) {
    return <div>loading...</div>;
  }

  return (
    !isAuthenticated && (
      <form onSubmit={handleSubmit}>
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
            error={formErrors.email}
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
            error={formErrors.firstName}
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
            error={formErrors.lastName}
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
            error={formErrors.password}
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
            error={formErrors.confirmPassword}
          />
        </div>
        <div>
          <button
            className={`${submitDisabled ? `${styles.disabled} disabled` : ''}`}
            disabled={submitDisabled}
            type="submit" // Use "submit" to trigger the form's onSubmit event
          >
            Sign Up
          </button>
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </form>
    )
  );
};

export default SignUp;
