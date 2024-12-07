import { useState, useEffect } from 'react';
import checkAuth from '../services/authService';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const auth = await checkAuth();
        setIsAuthenticated(auth.isAuthenticated);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthState();
  }, []);

  return { isAuthenticated, loading };
};

export default useAuth;
