import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Main from '../Main/Main';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const Layout = () => {
  const { authState } = useAuth();

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
