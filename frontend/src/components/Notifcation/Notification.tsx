import AlertIcon from '../icons/AlertIcon';
import CheckMarkIcon from '../icons/CheckMarkIcon';
import styles from './Notification.module.css';

interface NotificationProps {
  content: string | null;
  type: string;
}

const Notification = ({ content, type }: NotificationProps) => {
  return (
    <div className={`${styles.notification} notification`}>
      <p>{content}</p>
      {type === 'alert' ? (
        <AlertIcon />
      ) : type === 'success' ? (
        <CheckMarkIcon />
      ) : (
        ''
      )}
    </div>
  );
};

export default Notification;
