const API_URL = import.meta.env.VITE_API_URL;

export const fetchFooterInfo = async () => {
  const response = await fetch(`${API_URL}/users/footer-info`, {
    credentials: 'include',
  });

  if (!response.ok) {
    console.log('Failed fetching footer info');
  }

  const data = await response.json();
  return data.userFooterInfo;
};
