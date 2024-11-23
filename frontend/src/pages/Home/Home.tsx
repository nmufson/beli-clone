import styles from './Home.module.css';
import { Link } from 'react-router-dom';

import { useState } from 'react';

const Home = () => {
  return (
    <div>
      <h1>Booki</h1>
      {/* image coursel here with description of what you can do with Booki */}

      <Link to="/signup">Get Started</Link>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default Home;
