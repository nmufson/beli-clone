import styles from './ConfirmModal.module.css';
import CloseIcon from '../icons/CloseIcon';
import { unfollowUser } from '../../services/userService';

const ConfirmModal = ({
  setConfirmModalInfo,
  handleConfirm,
  title,
  content,
  cancelButtonContent = 'Cancel',
  confirmButtonContent,
}) => {
  const handleCloseModal = () => {
    setConfirmModalInfo((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirmClick = async (e) => {
    e.preventDefault();
    handleConfirm();
    setConfirmModalInfo((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <div className={`modal ${styles.confirmUnfollowModal}`}>
        <div className={styles.wrapper} onClick={handleCloseModal}>
          <CloseIcon />
        </div>
        <h2>{title}</h2>
        <p>{content}</p>
        <form onSubmit={handleConfirmClick}>
          <button onClick={handleCloseModal}>{cancelButtonContent}</button>
          <button type="submit">{confirmButtonContent}</button>
        </form>
      </div>
      <div className="backdrop" onClick={handleCloseModal}></div>
    </>
  );
};

export default ConfirmModal;
