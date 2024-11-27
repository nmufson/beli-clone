import styles from './PostPreview.module.css';
import { Link } from 'react-router-dom';
import createSlug from '../../utils/createSlug';
import HeartIcon from '../icons/HeartIcon';
import CommentIcon from '../icons/CommentIcon';
import PlusCircleOutlineIcon from '../icons/PlusCircleOutlineIcon';

interface PostPreviewProps {
  googleBooksId: string;
  userId: number;
  userFirstName: string;
  userLastName: string;
  title: string;
  author: string;
  userProfilePicUrl: string | undefined;
  rating: number | undefined;
  note: string | undefined;
  status: string;
  createdAt: Date;
}

const PostPreview = ({
  googleBooksId,
  userId,
  userFirstName,
  userLastName,
  title,
  author,
  userProfilePicUrl,
  rating,
  note,
  status,
  createdAt,
}: PostPreviewProps) => {
  const titleSlug = createSlug(title);
  const authorSlug = createSlug(author);

  return (
    <div className={styles.postPreview}>
      <div className={styles.top}>
        <Link to={`/user/${userId}/${userFirstName}-${userLastName}`}>
          <img
            className={styles.profileImage}
            src={userProfilePicUrl}
            alt={`${userFirstName} ${userLastName} profile picture`}
          />
        </Link>

        <div className={styles.titleContainer}>
          <p>
            <Link to={`/user/${userId}/${userFirstName}-${userLastName}`}>
              {userFirstName} {userLastName}{' '}
            </Link>
            {status === 'WANT_TO_READ'
              ? 'wants to read'
              : status === 'CURRENTLY_READING'
                ? 'is currently reading'
                : status === 'DID_NOT_FINISH'
                  ? 'did not finish'
                  : 'read'}{' '}
            <Link to={`/book/${googleBooksId}/${titleSlug}`}>{title}</Link>
          </p>
          <Link to={`/search/${authorSlug}`} className={styles.authorLink}>
            {' '}
            {author}
          </Link>
        </div>
        {status === 'FINISHED' && rating && (
          <div className={styles.ratingContainer}>
            <p>{rating}</p>
          </div>
        )}
      </div>

      {note && (
        <div className={styles.noteContainer}>
          <strong>Note:</strong> <p>{note}</p>
        </div>
      )}
      <div className={styles.buttonContainer}>
        <div className={styles.likeCommentContainer}>
          <HeartIcon />
          <CommentIcon />
        </div>
        <p>
          <PlusCircleOutlineIcon />
        </p>
      </div>
      <small>{createdAt}</small>
    </div>
  );
};

export default PostPreview;
