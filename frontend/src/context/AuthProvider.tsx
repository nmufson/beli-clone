import React, { createContext, useContext, useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL;

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextProps {
  authState: AuthState;
  setAuthState: (authState: AuthState) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  authState: { isAuthenticated: false, user: null },
  setAuthState: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  const logout = async () => {
    try {
      await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      setAuthState({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/users/auth/status`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setAuthState({ isAuthenticated: true, user: data.user });
        } else {
          setAuthState({ isAuthenticated: false, user: null });
        }
      } catch {
        setAuthState({ isAuthenticated: false, user: null });
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
