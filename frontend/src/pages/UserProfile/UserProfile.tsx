import { useParams } from 'react-router-dom';
import styles from './UserProfile.module.css';
import { fetchUserProfile } from '../../services/userService';
import { useEffect, useState } from 'react';
import PostPreview from '../../components/PostPreview/PostPreview';

// make it so the query only fetches necessary info
// needs to include userBooks
// have controller check if we follow them or not, and send that info for rendering
// make a date formatter
// type this

// User interface {
//   id: number;
//   email: string;
// }

const UserProfile = () => {
  const { userIdParam } = useParams();
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (userIdParam) {
        const userId = parseInt(userIdParam);
        try {
          const data = await fetchUserProfile(userId);
          setUser(data.user);
          setIsOwner(data.isOwner);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchProfile();
  }, [userIdParam]);

  return (
    user && (
      <div className={styles.profile}>
        <div className={styles.top}>
          <h1>
            {user.firstName} {user.lastName}
          </h1>
          <img
            src={user.profilePictureUrl}
            alt={`${user.firstName} ${user.lastName} profile picture`}
          />
          <button>Follow</button>
        </div>
        <div className={styles.followerFollowing}>
          {/* make these onClick to open modal of followers */}
          <div>
            <strong>xyz</strong>
            <small>Followers</small>
          </div>
          <div>
            {' '}
            <strong>xyz</strong>
            <small>Following</small>
          </div>
        </div>
        <div className={styles.lists}>
          {/* perhaps make these components */}
          {/* these will link to a seperate lists page */}
          <div>Read</div>
          <div>Want to Read</div>
          <div>Currently Reading</div>
          <div>Did Not Finish</div>
        </div>
        <div className={styles.userActivity}>
          <div className={styles.header}>
            <img src="" alt="" />
            <p>Recent Activity</p>
          </div>
          <div className={styles.recentBooks}>{/* fetch */}</div>
        </div>
      </div>
    )
  );
};

export default UserProfile;
