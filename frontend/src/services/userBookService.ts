// export const addBookToShelf = async (bookData, status) => {
//   const response = await fetch(`${API_URL}/books/shelve-book`, {
//     method: 'POST',
//     credentials: 'include',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ bookData, status }),
//   });
//   if (!response.ok) {
//     console.log('failed to add book to shelf');
//   }

//   const data = response.json();
//   return data;
// };

const API_URL = import.meta.env.VITE_API_URL;

export const addFinishedBook = async (bookData, userNote, userReaction) => {
  const response = await fetch(`${API_URL}/books/finish-book`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bookData, userNote, userReaction }),
  });
  if (!response.ok) {
    console.log('failed to add finished book');
  }

  const data = response.json();
  return data;
};

export const sendComparisonResults = async (
  addedBookId,
  reaction,
  newOrderedBooks,
) => {
  const response = await fetch(`${API_URL}/books/reorder-books`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ addedBookId, reaction, newOrderedBooks }),
  });
  if (!response.ok) {
    console.log('failed process comparison results');
  }

  const data = response.json();
  return data;
};

export const fetchUserBookLists = async (userId: string) => {
  const response = await fetch(`${API_URL}/books/user/${userId}/book-list`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    console.log('failed to get user book lists');
  }

  const data = response.json();
  return data;
};
