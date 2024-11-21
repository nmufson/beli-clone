const API_URL = import.meta.env.VITE_GBOOKS_API_URL;
const API_KEY = import.meta.env.VITE_GBOOKS_API_KEY;

const searchBook = async (searchTerms: string) => {
  const response = await fetch(`${API_URL}${searchTerms}&key=${API_KEY}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch books');
  }

  return await response.json();
};

export default searchBook;
