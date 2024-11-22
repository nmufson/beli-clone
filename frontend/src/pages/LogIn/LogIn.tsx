import styles from './LogIn.module.css';
import LabelInput from '../../components/LabelInput/LabelInput';
import { useState } from 'react';

const LogIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({
    emailError: '',
    passwordError: '',
  });

  return (
    <div>
      <h1>Welcome back!</h1>
      <small>Already have an account? Sign in below.</small>

      <form>
        <LabelInput label="Email" name="email" />
        <button>Log In</button>
      </form>
    </div>
  );
};

export default LogIn;
