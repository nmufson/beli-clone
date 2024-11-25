import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthProvider.tsx';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
