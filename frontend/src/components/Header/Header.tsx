import styles from './Header.module.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <Link to="/search" className={styles.searchButton}>
        Search for a book or author
      </Link>
    </header>
  );
};

export default Header;
