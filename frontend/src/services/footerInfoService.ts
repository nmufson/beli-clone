const API_URL = import.meta.env.VITE_API_URL;

export const fetchFooterInfo = async () => {
  const response = await fetch(`${API_URL}/users/footer-info`, {
    credentials: 'include', // Ensures cookies are sent with the request
    // backend uses cookie to look up session and determine
    // the user
    // exxpress-session stores session id is stored in a cookie
    // connect.sid
  });

  if (!response.ok) {
    console.log('Failed fetching footer info');
  }

  const data = await response.json();
  return data.userFooterInfo;
};
