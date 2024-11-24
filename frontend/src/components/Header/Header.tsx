import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const Header = () => {
  const location = useLocation();
  const pathName = location.pathname;
  const { authState } = useAuth();

  return (
    <header>
      <div className={styles.headerContainer}>
        <div className={styles.topContainer}>
          <Link to="/feed">Booki</Link>
        </div>

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
