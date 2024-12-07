import styles from './LikesModal.module.css';
import UserPreview from '../UserPreview/UserPreview';
import CloseIcon from '../icons/CloseIcon';

import { Like } from '../../types';

const LikesModal = ({ likes, setLikes }: Like[]) => {
  const handleCloseModal = () => {
    setLikes(null);
  };

  return (
    <>
      <div className={`modal ${styles.likesModal}`}>
        <div className={styles.wrapper} onClick={handleCloseModal}>
          <CloseIcon />
        </div>

        <div className={styles.userPreviews}>
          {likes.map((like) => (
            <UserPreview
              key={like.id}
              userFirstName={like.user.firstName}
              userLastName={like.user.lastName}
              userProfilePictureUrl={like.user.profilePictureUrl}
            />
          ))}
        </div>
      </div>
      <div className="backdrop" onClick={handleCloseModal}></div>
    </>
  );
};

export default LikesModal;
