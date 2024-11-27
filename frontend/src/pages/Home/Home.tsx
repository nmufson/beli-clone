import styles from './Home.module.css';
import { Link } from 'react-router-dom';

import { useState } from 'react';

const Home = () => {
  return (
    <div className={styles.home}>
      <h1>Booki</h1>
      {/* image coursel here with description of what you can do with Booki */}

      <Link to="/signup">Sign Up</Link>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
      <div className={styles.guestContainer}>
        <p>Or,</p>
        <Link to="/feed/guest">continue on as a guest</Link>
      </div>
    </div>
  );
};

export default Home;
