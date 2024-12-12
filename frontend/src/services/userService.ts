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

// router.post(
//   '/follow-requests',
//   checkAuthenticated,
//   userController.sendFollowRequest,
// );
// router.put(
//   '/follow-requests',
//   checkAuthenticated,
//   userController.respondToFollowRequest,
// );

// router.delete(
//   'follow-requests',
//   checkAuthenticated,
//   userController.cancelFollowRequest,

// export const fetchUserPreviews = async (userIds: number[]) => {
//   const queryParams = new URLSearchParams({ userIds: userIds.join(',') });

//   const response = await fetch(
//     `${API_URL}/users/user-previews/${queryParams}`,
//     {
//       credentials: 'include',
//     },
//   );

//   if (!response.ok) {
//     console.log('failed fetching user previews');
//   }

//   const data = response.json();
//   return data;
// };
