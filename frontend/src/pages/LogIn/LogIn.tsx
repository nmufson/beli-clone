import styles from './LogIn.module.css';
import LabelInput from '../../components/LabelInput/LabelInput';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { logInUser } from '../../services/logInService';
import { Link } from 'react-router-dom';
import { validateLogin } from './LogInValidation';
import useAuth from '../../hooks/useAuth';
import { useNavigate, useOutletContext } from 'react-router-dom';

const LogIn = () => {
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  const { isAuthenticated, loading } = useOutletContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed/user');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const sanitizedValue = DOMPurify.sanitize(value.trim());

    const newFormData = {
      ...formData,
      [name]: sanitizedValue,
    };

    setFormData(newFormData);

    const newFormErrors = validateLogin(
      name,
      value,
      { ...formData, [name]: sanitizedValue },
      formErrors,
      setFormErrors,
    );

    const hasErrors = Object.values(newFormErrors).some(
      (error) => error !== '',
    );
    const isFilledOut = Object.values(newFormData).every(
      (value) => value !== '',
    );
    setSubmitDisabled(hasErrors || !isFilledOut);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    validateLogin(name, value, formData, formErrors, setFormErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await logInUser(formData, setFormErrors);
      console.log(user);

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
      <div>
        <h1>Welcome back!</h1>
        <small>Sign in below.</small>

        <form onSubmit={handleSubmit}>
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
          <div>
            <button
              className={`${submitDisabled ? `${styles.disabled} disabled` : ''}`}
              disabled={submitDisabled}
              type="submit"
            >
              Log In
            </button>
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </form>
      </div>
    )
  );
};

export default LogIn;
