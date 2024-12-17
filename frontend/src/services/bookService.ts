const API_URL = import.meta.env.VITE_API_URL;

export const fetchBookByGoogleId = async (googleBooksId: string) => {
  const response = await fetch(`${API_URL}/books/book/${googleBooksId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    console.log('failed to retrieve user book');
  }

  const data = response.json();
  console.log(data);
  return data;
};
