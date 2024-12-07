import styles from './UserPreview.module.css';

interface UserPreviewProps {
  userFirstName: string;
  userLastName: string;
  userProfilePictureUrl: string;
}

const UserPreview = ({
  userFirstName,
  userLastName,
  userProfilePictureUrl,
}: UserPreviewProps) => {
  const userFullName = userFirstName + ' ' + userLastName;

  return (
    <div className={styles.userPreview}>
      <img
        src={userProfilePictureUrl}
        alt={`${userFullName} profile picture`}
      />
      <p>{userFullName}</p>
    </div>
  );
};

export default UserPreview;
