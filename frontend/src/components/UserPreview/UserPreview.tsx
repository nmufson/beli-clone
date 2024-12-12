import styles from './UserPreview.module.css';
import { Link, useNavigate } from 'react-router-dom';

interface UserPreviewProps {
  userId: number;
  userFirstName: string;
  userLastName: string;
  userProfilePictureUrl: string;
}

const UserPreview = ({
  userId,
  userFirstName,
  userLastName,
  userProfilePictureUrl,
  handleCloseModal,
}: UserPreviewProps) => {
  const userFullName = userFirstName + ' ' + userLastName;
  const navigate = useNavigate();

  const handleUserClick = () => {
    handleCloseModal();
    navigate(`/user/${userId}/${userFirstName}-${userLastName}`);
  };

  return (
    <div onClick={handleUserClick} className={styles.userPreview}>
      <img
        src={userProfilePictureUrl}
        alt={`${userFullName} profile picture`}
      />
      <p>{userFullName}</p>
    </div>
  );
};

export default UserPreview;
