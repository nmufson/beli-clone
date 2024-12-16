import { useEffect, useState } from 'react';
import styles from './Notifications.module.css';
import { fetchNotifications } from '../../services/userService';
import Notification from '../../components/Notification/Notification';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data.notifications);
      } catch (error) {
        console.log(error);
      }
    };
    getNotifications();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Notifications</h1>
      <div className={styles.notifications}>
        {notifications?.length > 0 ? (
          notifications.map((notification) => (
            <Notification
              type={notification.type}
              user={notification.user}
              book={notification.book}
              date={notification.createdAt}
            />
          ))
        ) : (
          <p>You have no notifications</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
