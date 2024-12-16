import styles from './Leaderboard.module.css';
import UserPreview from '../../components/UserPreview/UserPreview';
import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../../services/userService';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchLeaderboard();
        setUsers(data.users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className={styles.leaderboard}>
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.id} className={styles.userItem}>
            <UserPreview
              userId={user.id}
              userFirstName={user.firstName}
              userLastName={user.lastName}
              userProfilePictureUrl={user.profilePictureUrl}
            />
            <p>{user['_count'].books}</p>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Leaderboard;
