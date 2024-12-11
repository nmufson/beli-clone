import styles from './UserListModal.module.css';
import UserPreview from '../UserPreview/UserPreview';
import CloseIcon from '../icons/CloseIcon';

import { Like } from '../../types';

const UserListModal = ({
  title,
  users = null,
  likes = null,
  setLikes = () => {},
  handleClose = () => {},
}: Like[]) => {
  const handleCloseModal = () => {
    handleClose();
    setLikes(null);
  };

  return (
    <>
      <div className={`modal ${styles.userListModal}`}>
        {title}
        <div className={styles.wrapper} onClick={handleCloseModal}>
          <CloseIcon />
        </div>

        <div className={styles.userPreviews}>
          {(likes || users).map((item) => (
            <UserPreview
              key={item.id ? item.id : item.user.id}
              userFirstName={
                item.firstName ? item.firstName : item.user.firstName
              }
              userLastName={item.lastName ? item.lastName : item.user.lastName}
              userProfilePictureUrl={
                item.profilePictureUrl
                  ? item.profilePictureUrl
                  : item.user.profilePictureUrl
              }
            />
          ))}
        </div>
      </div>
      <div className="backdrop" onClick={handleCloseModal}></div>
    </>
  );
};

export default UserListModal;
