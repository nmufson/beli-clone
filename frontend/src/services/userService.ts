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
