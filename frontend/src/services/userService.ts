const API_URL = import.meta.env.VITE_API_URL;

export const fetchUserProfile = async (userId: number) => {
  const response = await fetch(`${API_URL}/users/user/${userId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    console.log('failed fetching user profile');
  }

  const data = response.json();
  return data;
};

export const sendFollowRequest = async (receiverId: number) => {
  const response = await fetch(`${API_URL}/users/follow-requests`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ receiverId }),
  });

  if (!response.ok) {
    console.log('failed to send follow request');
  }
  const data = response.json();
  return data;
};

export const cancelFollowRequest = async (receiverId: number) => {
  const response = await fetch(`${API_URL}/users/follow-requests`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ receiverId }),
  });

  if (!response.ok) {
    console.log('failed to cancel follow request');
  }
};

export const unfollowUser = async (userId: number) => {
  const response = await fetch(`${API_URL}/users/followers`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    console.log('failed to unfollow user');
  }
};

export const fetchLeaderboard = async () => {
  const response = await fetch(`${API_URL}/users/leaderboard`, {
    credentials: 'include',
  });

  if (!response.ok) {
    console.log('failed to fetch leaderboard');
  }

  const data = response.json();
  return data;
};

export const fetchNotifications = async () => {
  const response = await fetch(`${API_URL}/users/notifications`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    console.log('failed to fetch notifications');
  }

  const data = response.json();
  return data;
};
