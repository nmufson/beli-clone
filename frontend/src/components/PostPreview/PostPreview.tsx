import styles from './PostPreview.module.css';
import { Link } from 'react-router-dom';
import createSlug from '../../utils/createSlug';
import HeartIcon from '../icons/HeartIcon';
import CommentIcon from '../icons/CommentIcon';
import PlusCircleOutlineIcon from '../icons/PlusCircleOutlineIcon';
import { Like, Comment } from '../../types';
import { useState } from 'react';

import formatDate from '../../utils/formatDate';
import { deleteLike, fetchLikes } from '../../services/feedService';
import { useNavigate } from 'react-router-dom';
import { likePostOrComment } from '../../services/feedService';
import useAuth from '../../hooks/useAuth';
import CheckMarkIcon from '../icons/CheckMarkIcon';

interface PostPreviewProps {}

const PostPreview = ({
  post,
  setModalLikes = () => {},
  setNotificationInfo,
  setSelectedPost = () => {},
  onFeed,
  isAuthenticated,
  setAddToListInfo,
}) => {
  const {
    id,
    googleBooksId,
    userId,
    user,
    title,
    author,
    autoRating,
    userNote,
    status,
    createdAt,
    likes,
    comments,
    userLikeId,
    loggedInUserBookStatus,
    loggedInUserBookId,
    userReaction,
  } = post;
  const titleSlug = createSlug(title);
  const authorSlug = createSlug(author);

  const [likeCount, setLikeCount] = useState(likes.length);
  const commentCount = comments.length;

  const [likeId, setLikeId] = useState(userLikeId);

  const navigate = useNavigate();

  const handleLikeInfoClick = async () => {
    try {
      const data = await fetchLikes(id, true);
      const likes = data.userBookLikes;
      setModalLikes(likes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentInfoClick = () => {
    navigate(`/post/${id}`);
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
          const data = await likePostOrComment(true, id);
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
      setAddToListInfo({
        isOpen: true,
        postId: id,
        loggedInUserBookStatus,
        loggedInUserBookId,
      });
      if (onFeed) {
        setSelectedPost(post);
      }
    }
  };

  return (
    <>
      <div className={styles.postPreview}>
        <div className={styles.top}>
          <Link to={`/user/${userId}/${user.firstName}-${user.lastName}`}>
            <img
              className={styles.profileImage}
              src={user.profilePictureUrl}
              alt={`${user.firstName} ${user.lastName} profile picture`}
            />
          </Link>

          <div className={styles.titleContainer}>
            <p>
              <Link to={`/user/${userId}/${user.firstName}-${user.lastName}`}>
                {user.firstName} {user.lastName}{' '}
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
          {status === 'FINISHED' && autoRating && (
            <div
              className={`${styles.ratingContainer} ${userReaction === 'LIKED' ? styles.liked : userReaction === 'OKAY' ? styles.okay : styles.disliked}`}
            >
              <p className={styles.rating}>{autoRating.toFixed(1)}</p>
            </div>
          )}
        </div>

        {userNote && (
          <div className={styles.noteContainer}>
            <strong>Note:</strong> <p>{userNote}</p>
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
