const API_URL = import.meta.env.VITE_API_URL;

const checkAuth = async () => {
  const response = await fetch(`${API_URL}/auth/check`, {
    credentials: 'include',
  });
  if (!response.ok) {
    console.log('Not authenticated');
  }

  const data = await response.json();

  return data;
};

export default checkAuth;
