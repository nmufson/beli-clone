const API_URL = import.meta.env.VITE_API_URL;

export const respondToFollowRequest = async (
  senderId: number,
  accepted: boolean,
) => {
  const response = await fetch(`${API_URL}/users/follow-requests`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ senderId, accepted }),
  });

  if (!response.ok) {
    console.log('failed to respond to follow request');
  }
};
