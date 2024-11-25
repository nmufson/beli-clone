import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { logOutUser } from '../../services/logInService';

const Header = () => {
  const location = useLocation();
  const pathName = location.pathname;
  const { authState } = useAuth();

  const handleLogOut = async () => {
    const data = await logOutUser();
    console.log(data);
  };

  return (
    <header>
      <div className={styles.headerContainer}>
        <div className={styles.topContainer}>
          <Link to="/feed">Booki</Link>
        </div>
        {authState.isAuthenticated && (
          <button onClick={handleLogOut}>Log out</button>
        )}
      </div>
      <div>
        {(pathName === '/' || pathName === '/feed') && (
          <Link to="/search" className={styles.searchButton}>
            Search for a book or author
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
