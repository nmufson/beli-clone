const API_URL = import.meta.env.VITE_API_URL;

interface FormData {
  email: string;
  password: string;
}

export const logInUser = async (formData: FormData, setFormErrors) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    if (data.message.includes('password')) {
      setFormErrors((prev) => ({
        ...prev,
        password: data.message,
      }));
    } else if (data.message.includes('Email')) {
      setFormErrors((prev) => ({
        ...prev,
        email: data.message,
      }));
    }
  }

  return data;
};

export const logOutUser = async () => {
  const response = await fetch(`${API_URL}/users/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  if (!response.ok) {
    console.log('Failed logging out');
  }

  return data;
};
