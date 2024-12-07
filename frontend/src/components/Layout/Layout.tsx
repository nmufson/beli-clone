import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Main from '../Main/Main';
import { Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// maybe move some of the dupe states in Feed and Post to here?
// pass it down through context?

const Layout = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <>
      <Header isAuthenticated={isAuthenticated} />
      <Main>
        <Outlet context={{ isAuthenticated, loading }} />
      </Main>
      <Footer isAuthenticated={isAuthenticated} />
    </>
  );
};

export default Layout;
