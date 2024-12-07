import styles from './Comment.module.css';
import HeartIcon from '../icons/HeartIcon';
import { useState } from 'react';
import { fetchLikes } from '../../services/feedService';

import { likePostOrComment, deleteLike } from '../../services/feedService';

interface CommentProps {
  commentId: number;
  userFirstName: string;
  userLastName: string;
  userProfilePictureUrl: string;
  content: string;
  commentLikes: string;
  isAuthenticated: boolean;
}

const Comment = ({
  commentId,
  userFirstName,
  userLastName,
  userProfilePictureUrl,
  content,
  commentLikes,
  setModalLikes,
  userLikeId,
  setNotificationInfo,
  isAuthenticated,
}: CommentProps) => {
  const userFullName = userFirstName + ' ' + userLastName;

  const [likeCount, setLikeCount] = useState(commentLikes.length);
  const [likeId, setLikeId] = useState(userLikeId);

  const handleLikeInfoClick = async () => {
    try {
      const data = await fetchLikes(commentId, false);
      const likes = data.commentLikes;
      setModalLikes(likes);
    } catch (error) {
      console.log(error);
    }
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
          const data = await likePostOrComment(false, commentId);
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

  return (
    <div className={styles.comment}>
      <img
        src={userProfilePictureUrl}
        alt={`${userFullName} profile picture`}
      />
      <div className={styles.rightContainer}>
        <div className={styles.userAndContent}>
          <p>
            <strong>{userFullName}</strong>
            {content}
          </p>
          <small onClick={handleLikeInfoClick}>
            {likeCount === 1
              ? '1 like'
              : likeCount > 1
                ? `${likeCount} likes`
                : ''}
          </small>
        </div>

        <HeartIcon
          handleClick={handleLikeButtonClick}
          isLiked={likeId ? true : false}
        />
      </div>
    </div>
  );
};

export default Comment;
