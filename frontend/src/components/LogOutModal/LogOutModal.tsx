import styles from './LogOutModal.module.css';
import CloseIcon from '../icons/CloseIcon';
import { logOutUser } from '../../services/logInService';

const LogOutModal = ({ setIsModalOpen }) => {
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmLogOut = async () => {
    try {
      await logOutUser();
      window.location.href = '/feed/guest';
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={`modal ${styles.logOutModal}`}>
        <div className={styles.wrapper} onClick={handleCloseModal}>
          <CloseIcon />
        </div>
        <h2>Log Out</h2>
        <p>Are you sure you want to log out?</p>
        <form onSubmit={handleConfirmLogOut}>
          <button onClick={handleCloseModal}>Cancel</button>
          <button type="submit">Log Out</button>
        </form>
      </div>
      <div className="backdrop" onClick={handleCloseModal}></div>
    </>
  );
};

const confirmModal = ({ setIsModalOpen, handleConfirm }) => {
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={`modal ${styles.logOutModal}`}>
        <div className={styles.wrapper} onClick={handleCloseModal}>
          <CloseIcon />
        </div>
        <h2>Log Out</h2>
        <p>Are you sure you want to log out?</p>
        <form onSubmit={handleConfirm}>
          <button onClick={handleCloseModal}>Cancel</button>
          <button type="submit">Log Out</button>
        </form>
      </div>
      <div className="backdrop" onClick={handleCloseModal}></div>
    </>
  );
};

export default LogOutModal;
