import AlertIcon from '../icons/AlertIcon';
import CheckMarkIcon from '../icons/CheckMarkIcon';
import styles from './Alert.module.css';

interface NotificationProps {
  content: string | null;
  type: string;
}

const Alert = ({ content, type }: NotificationProps) => {
  return (
    <div className={`${styles.alert} alert`}>
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

export default Alert;
