const API_URL = import.meta.env.VITE_API_URL;

export const fetchPosts = async (type: string | undefined) => {
  const response = await fetch(`${API_URL}/feed/${type}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    console.log('failed fetching posts');
  }

  const data = response.json();
  return data;
};
