const API_URL_SEARCH = import.meta.env.VITE_GBOOKS_API_URL;
const API_URL_BOOKID = import.meta.env.VITE_GBOOKS_API_URL_BOOKID;
const API_KEY = import.meta.env.VITE_GBOOKS_API_KEY;

export const searchBook = async (searchTerms: string) => {
  const response = await fetch(
    `${API_URL_SEARCH}${searchTerms}&key=${API_KEY}`,
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch books');
  }

  const data = await response.json();
  const items = data.items || [];
  const books = transformBookData(items);

  const uniqueBooks = new Map();

  books.forEach((book) => {
    const title = book.title;
    if (!uniqueBooks.has(title)) {
      uniqueBooks.set(title, book);
    }
  });

  const bookResults = Array.from(uniqueBooks.values());

  return bookResults;
};

export const fetchBookById = async (bookId: string) => {
  const response = await fetch(`${API_URL_BOOKID}${bookId}?key=${API_KEY}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch books');
  }

  const data = await response.json();
  console.log(data);
  const book = transformSingleBook(data);
  console.log(book);
  return book;
};

export const searchBookOpenLib = async (searchTerms: string) => {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${searchTerms}`,
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch books');
  }

  return await response.json();
};

function transformSingleBook(item) {
  console.log(item);
  const volumeInfo = item.volumeInfo || {};
  return {
    googleBooksId: item.id,
    title: volumeInfo.title || 'Unknown Title',
    author: (volumeInfo.authors && volumeInfo.authors[0]) || 'Unknown Author',
    imageURL: volumeInfo.imageLinks?.thumbnail || null,
    genre: volumeInfo.categories?.[0] || 'Unknown Genre',
    description: volumeInfo.description || null,
    pageCount: volumeInfo.pageCount || 0,
    rating: volumeInfo.averageRating || 0,
    ratingCount: volumeInfo.ratingsCount || 0,
  };
}

function transformBookData(items) {
  return items.map((item) => transformSingleBook(item));
}
