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

export const fetchLikes = async (id: number, isPost: boolean) => {
  let response;
  if (isPost) {
    response = await fetch(`${API_URL}/books/${id}/likes`, {
      credentials: 'include',
    });
  } else {
    response = await fetch(`${API_URL}/books/comments/${id}/likes`, {
      credentials: 'include',
    });
  }

  if (!response.ok) {
    console.log('failed fetching likes');
  }

  const data = response.json();
  return data;
};

export const fetchPost = async (userBookId: string | undefined) => {
  const response = await fetch(`${API_URL}/books/${userBookId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    console.log('failed fetching post');
  }

  const data = response.json();

  return data;
};

export const likePostOrComment = async (isPost: boolean, id: number) => {
  let response;
  if (isPost) {
    response = await fetch(`${API_URL}/books/${id}`, {
      method: 'POST',
      credentials: 'include',
    });
  } else {
    response = await fetch(`${API_URL}/books/comment/${id}`, {
      method: 'POST',
      credentials: 'include',
    });
  }
  if (!response.ok) {
    console.log('failed adding like');
  }

  const data = response.json();
  return data;
};

export const deleteLike = async (likeId: number) => {
  const response = await fetch(`${API_URL}/books/like/${likeId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    console.log('failed to delete like');
  }

  console.log('like deleted successfully');
};

export const postComment = async (
  userBookId: string | undefined,
  content: string,
) => {
  const response = await fetch(`${API_URL}/books/${userBookId}/comment`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    console.log('failed to post comment');
  }
  const data = response.json();
  return data;
};

export const updateShelf = async (
  oldStatus: string,
  userBookId: number,
  newStatus: string,
) => {
  const response = await fetch(`${API_URL}/books/${userBookId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ oldStatus, newStatus }),
  });
  if (!response.ok) {
    console.log('failed to update shelf');
  }

  const data = response.json();
  return data;
};

export const removeBookFromShelf = async (userBookId: number) => {
  const response = await fetch(`${API_URL}/books/${userBookId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    console.log('failed to remove book from shelf');
  }

  const data = response.json();
  return data;
};

export const addBookToShelf = async (bookData, status) => {
  const response = await fetch(`${API_URL}/books/shelve-book`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bookData, status }),
  });
  if (!response.ok) {
    console.log('failed to add book to shelf');
  }

  const data = response.json();
  return data;
};
