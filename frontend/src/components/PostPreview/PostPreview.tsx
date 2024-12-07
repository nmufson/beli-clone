import styles from './PostPreview.module.css';
import { Link } from 'react-router-dom';
import createSlug from '../../utils/createSlug';
import HeartIcon from '../icons/HeartIcon';
import CommentIcon from '../icons/CommentIcon';
import PlusCircleOutlineIcon from '../icons/PlusCircleOutlineIcon';
import { Like, Comment } from '../../types';
import { useState } from 'react';
import LikesModal from '../../components/LikesModal/LikesModal';
import formatDate from '../../utils/formatDate';
import { deleteLike, fetchLikes } from '../../services/feedService';
import { useNavigate } from 'react-router-dom';
import { likePostOrComment } from '../../services/feedService';
import useAuth from '../../hooks/useAuth';
import CheckMarkIcon from '../icons/CheckMarkIcon';

interface PostPreviewProps {
  bookId: number;
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
  likes: Like[];
  comments: Comment[];
  // setLikeUserPreviews:

  // setNotificationInfo
  onFeed: boolean;
}

const PostPreview = ({
  bookId,
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
  likes,
  comments,
  setModalLikes,
  setNotificationInfo,
  onFeed,
  userLikeId,
  isAuthenticated,
  setAddToListInfo,
  loggedInUserBookStatus,
  loggedInUserBookId,
}: PostPreviewProps) => {
  const titleSlug = createSlug(title);
  const authorSlug = createSlug(author);

  const [likeCount, setLikeCount] = useState(likes.length);
  const commentCount = comments.length;

  const [likeId, setLikeId] = useState(userLikeId);

  const navigate = useNavigate();

  const handleLikeInfoClick = async () => {
    try {
      const data = await fetchLikes(bookId, true);
      const likes = data.userBookLikes;
      setModalLikes(likes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentInfoClick = () => {
    navigate(`/post/${bookId}`);
  };

  const handleLikeButtonClick = async () => {
    if (!isAuthenticated) {
      setNotificationInfo({
        isVisible: true,
        content: 'Must be logged in to interact with posts',
      });
      setTimeout(
        () => setNotificationInfo({ isVisible: false, content: null }),
        2000,
      );
    } else {
      try {
        if (!likeId) {
          const data = await likePostOrComment(true, bookId);
          console.log(data);
          setLikeId(data.newLike.id);
          setLikeCount((prev) => prev + 1);
        } else {
          await deleteLike(likeId);
          setLikeId(null);
          setLikeCount((prev) => prev - 1);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleListButtonClick = () => {
    setAddToListInfo({
      isOpen: true,
      postId: bookId,
      loggedInUserBookStatus,
      loggedInUserBookId,
    });
  };

  return (
    <>
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

        <div className={styles.interactionContainer}>
          <div className={styles.likeCommentContainer}>
            <div className={styles.likeCommentInfo}>
              <small onClick={handleLikeInfoClick}>
                {likeCount === 1
                  ? '1 like'
                  : likeCount > 1
                    ? `${likeCount} likes`
                    : ''}
              </small>

              {onFeed && (
                <small onClick={handleCommentInfoClick}>
                  {commentCount === 1
                    ? 'View 1 comment'
                    : commentCount > 1
                      ? `View ${commentCount} comments`
                      : ''}
                </small>
              )}
            </div>
            <div className={styles.likeCommentButtons}>
              <HeartIcon
                handleClick={handleLikeButtonClick}
                isLiked={likeId ? true : false}
              />
              {onFeed && <CommentIcon handleClick={handleCommentInfoClick} />}
            </div>
          </div>
          {loggedInUserBookStatus ? (
            <CheckMarkIcon handleClick={handleListButtonClick} />
          ) : (
            <PlusCircleOutlineIcon handleClick={handleListButtonClick} />
          )}
        </div>
        <small>{formatDate(createdAt)}</small>
      </div>
    </>
  );
};

export default PostPreview;
