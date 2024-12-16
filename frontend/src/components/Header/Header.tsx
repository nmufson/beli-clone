import styles from './Header.module.css';
import {
  Link,
  useOutletContext,
  useParams,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import BellIcon from '../icons/BellIcon';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { logOutUser } from '../../services/logInService';
import LogOutModal from '../LogOutModal/LogOutModal';

const Header = ({ isAuthenticated }) => {
  const location = useLocation();
  const pathName = location.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogOutButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleLogInButtonClick = () => {
    navigate('/login');
  };

  const handleBellClick = () => {
    navigate('/notifications');
    console.log('yoo');
  };

  return (
    <>
      <header>
        <div className={styles.headerContainer}>
          <div className={styles.topContainer}>
            <Link to={isAuthenticated ? '/feed/user' : '/feed/guest'}>
              Booki
            </Link>

            {isAuthenticated ? (
              <button
                className={styles.logOut}
                onClick={handleLogOutButtonClick}
              >
                Log Out
              </button>
            ) : (
              <button onClick={handleLogInButtonClick}>Log In</button>
            )}
            <BellIcon handleClick={handleBellClick} />
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
      {isModalOpen && <LogOutModal setIsModalOpen={setIsModalOpen} />}
    </>
  );
};

export default Header;
