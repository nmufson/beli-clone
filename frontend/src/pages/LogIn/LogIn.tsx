import styles from './LogIn.module.css';
import LabelInput from '../../components/LabelInput/LabelInput';
import { useState } from 'react';

const LogIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  return (
    <div>
      <h1>Welcome back!</h1>
      <small>Already have an account? Sign in below.</small>

      <form>
        {/* <LabelInput label="Email" name="email" /> */}
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
        <button>Log In</button>
      </form>
    </div>
  );
};

export default LogIn;
