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

  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<SignUpFormErrors>>({});
  const [userFeedback, setUserFeedback] = useState<Partial<SignUpUserFeedback>>(
    {},
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newFormData = {
        ...prevData,
        [name]: DOMPurify.sanitize(value.trim()),
      };

      validateField(name, value, newFormData, setFormErrors);
      return newFormData;
    });

    if (!formErrors[name]) {
      setUserFeedback((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    validateField(name, formData[name], formData, setFormErrors).then(() => {
      setUserFeedback((prev) => ({
        ...prev,
        [name]: formErrors[name] || '',
      }));
    });
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
          onChange={handleChange}
          onBlur={handleBlur}
          userFeedBack={userFeedback}
        />
        <LabelInput
          label="First Name"
          name="firstName"
          value={formData.firstName}
          placeholder="First name"
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          userFeedBack={userFeedback}
        />
        <LabelInput
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          placeholder="Last name"
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          userFeedBack={userFeedback}
        />
        <LabelInput
          label="Password"
          name="password"
          value={formData.password}
          placeholder="Password"
          type="password"
          onChange={handleChange}
          onBlur={handleBlur}
          userFeedBack={userFeedback}
        />
        <LabelInput
          label="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          placeholder="Confirm password"
          type="password"
          onChange={handleChange}
          onBlur={handleBlur}
          userFeedBack={userFeedback}
        />
      </div>
      <div>
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
