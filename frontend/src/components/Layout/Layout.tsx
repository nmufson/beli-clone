import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Main from '../Main/Main';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Layout = () => {
  const location = useLocation();

  // define auth state here and pass it to context
  // have log in / sign up / log out pages affect this state
  // authState({isAuth: bool, user: req.user from backend})

  return (
    <>
      <Header />
      <Main>
        <Outlet context={{}} />
      </Main>
      <Footer />
    </>
  );
};

export default Layout;
