import styles from './UnfollowModal.module.css';
import CloseIcon from '../icons/CloseIcon';
import { unfollowUser } from '../../services/userService';

// const UnfollowModal = ({
//   setIsModalOpen,
//   handleConfirm,
//   fullName,
//   userId,
//   setOtherInfo,
// }) => {
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleConfirmClick = async (e) => {
//     e.preventDefault();
//     try {
//       await unfollowUser(userId);
//       setOtherInfo((prev) => ({
//         ...prev,
//         following: false,
//       }));
//       setIsModalOpen(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <>
//       <div className={`modal ${styles.confirmUnfollowModal}`}>
//         <div className={styles.wrapper} onClick={handleCloseModal}>
//           <CloseIcon />
//         </div>
//         <h2>Unfollow User</h2>
//         <p>Are you sure you want to unfollow {fullName}?</p>
//         <form onSubmit={handleConfirmClick}>
//           <button onClick={handleCloseModal}>Cancel</button>
//           <button type="submit">Unfollow</button>
//         </form>
//       </div>
//       <div className="backdrop" onClick={handleCloseModal}></div>
//     </>
//   );
// };

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
