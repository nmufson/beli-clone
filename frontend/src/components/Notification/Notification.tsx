import styles from './Notification.module.css';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';

const Notification = ({ type, user, book, date }) => {
  return (
    <div className={styles.notification}>
      <Link to={`/user/${user.id}/${user.firstName}-${user.lastName}`}>
        <img
          src={user.profilePictureUrl}
          alt={`${user.firstName} ${user.lastName} image`}
          className={styles.userImage}
        />{' '}
      </Link>
      <div className={styles.centerDiv}>
        <p>
          <Link to={`/user/${user.id}/${user.firstName}-${user.lastName}`}>
            {user.firstName} {user.lastName}
          </Link>{' '}
          {type === 'like_on_book' ? (
            <>
              liked your{' '}
              <Link to={`/post/${book.id}`}>post about {book.title}</Link>
            </>
          ) : type === 'comment_on_book' ? (
            <>
              commented on your{' '}
              <Link to={`/post/${book.id}`}>post about {book.title}</Link>
            </>
          ) : type === 'like_on_comment' ? (
            <>
              liked <Link to={`/post/${book.id}`}>your comment</Link>
            </>
          ) : type === 'follow_request' ? (
            'requested to follow you'
          ) : (
            ''
          )}{' '}
        </p>
        <small>{formatDate(date)}</small>
      </div>
      {(type === 'like_on_book' ||
        type === 'comment_on_book' ||
        type === 'like_on_comment') && (
        <Link to={`/post/${book.id}`}>
          <img
            src={book.imageUrl}
            alt={`${book.title} image`}
            className={styles.bookImage}
          />
        </Link>
      )}
    </div>
  );
};

export default Notification;
