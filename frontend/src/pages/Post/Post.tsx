import styles from './Post.module.css';
import PostPreview from '../../components/PostPreview/PostPreview';
import { useParams, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchPost, postComment } from '../../services/feedService';
import Comment from '../../components/Comment/Comment';
import UserListModal from '../../components/UserListModal/UserListModal';
import Notification from '../../components/Notifcation/Notification';
import useAuth from '../../hooks/useAuth';
import AddToList from '../../components/AddToList/AddToList';

//make the comment input fixed posiiton
const Post = () => {
  const { userBookId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [modalLikes, setModalLikes] = useState(null);
  const [commentValue, setCommentValue] = useState('');
  const [notificationInfo, setNotificationInfo] = useState({
    isVisible: false,
    content: null,
  });
  const [addToListInfo, setAddToListInfo] = useState({
    isOpen: false,
    loggedInUserBookId: null,
    loggedInUserBookStatus: null,
  });

  const { isAuthenticated, loading } = useOutletContext();

  const onCommentChange = (e) => {
    const value = e.target.value;
    setCommentValue(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log(userBookId);
      try {
        const data = await fetchPost(userBookId);
        const post = data.userBook;
        setPost(post);
        setComments(post.comments);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userBookId]);

  // trim and sanitize the comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      if (commentValue) {
        const data = await postComment(userBookId, commentValue);
        const newComment = data.newComment;
        setComments((prev) => [...prev, newComment]);
        setCommentValue('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={styles.post}>
        <div className={styles.topContainer}>
          {post && (
            <PostPreview
              key={post.id}
              post={post}
              setModalLikes={setModalLikes}
              setNotificationInfo={setNotificationInfo}
              onFeed={true}
              isAuthenticated={isAuthenticated}
              setAddToListInfo={setAddToListInfo}
            />
          )}
          <div className={styles.comments}>
            {post &&
              comments.map((comment) => (
                <Comment
                  key={comment.id}
                  commentId={comment.id}
                  userFirstName={comment.user.firstName}
                  userLastName={comment.user.lastName}
                  userProfilePictureUrl={comment.user.profilePictureUrl}
                  content={comment.content}
                  commentLikes={comment.likes}
                  setModalLikes={setModalLikes}
                  userLikeId={comment.userCommentLikeId}
                  setNotificationInfo={setNotificationInfo}
                  isAuthenticated={isAuthenticated}
                />
              ))}
          </div>
        </div>
        <form onSubmit={handleSubmitComment} className={styles.commentForm}>
          <textarea
            onChange={onCommentChange}
            className={styles.writeComment}
            disabled={!isAuthenticated}
            name="comment"
            id="comment"
            placeholder={
              isAuthenticated
                ? 'Leave a comment below...'
                : 'Log in to leave a comment'
            }
            maxLength={100}
            value={commentValue}
          ></textarea>
          {commentValue && <button type="submit">Post</button>}
        </form>
      </div>

      {modalLikes && (
        <UserListModal
          title="likes"
          likes={modalLikes}
          setLikes={setModalLikes}
        />
      )}
      {notificationInfo.isVisible && (
        <Notification content={notificationInfo.content} type="alert" />
      )}
      {addToListInfo.isOpen && (
        <AddToList
          loggedInUserBookStatus={post.loggedInUserBookStatus}
          loggedInUserBookId={post.loggedInUserBookId}
          setAddToListInfo={setAddToListInfo}
          onFeed={false}
          selectedPost={post}
          setPost={setPost}
        />
      )}
    </>
  );
};

export default Post;
