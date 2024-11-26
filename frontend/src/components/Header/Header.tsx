import styles from './Header.module.css';
import { Link, useOutletContext } from 'react-router-dom';
import { useParams, useLocation } from 'react-router-dom';

import { logOutUser } from '../../services/logInService';

const Header = () => {
  const location = useLocation();
  const pathName = location.pathname;

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
