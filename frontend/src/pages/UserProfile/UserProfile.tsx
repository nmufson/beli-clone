import { useParams } from 'react-router-dom';
import styles from './UserProfile.module.css';
import { fetchUserProfile } from '../../services/userService';
import { useEffect, useState } from 'react';
import PostPreview from '../../components/PostPreview/PostPreview';
import UserListModal from '../../components/UserListModal/UserListModal';
import useAuth from '../../hooks/useAuth';
import Notification from '../../components/Notifcation/Notification';
import {
  sendFollowRequest,
  cancelFollowRequest,
} from '../../services/userService';
import BookList from '../../components/BookList/BookList';
// needs to include userBooks
// and posts
// have controller check if we follow them or not, and send that info for rendering
// make a date formatter
// type this

// User interface {
//   id: number;
//   email: string;
// }

const UserProfile = () => {
  const { userIdParam } = useParams();
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [bookListInfo, setBookListInfo] = useState({
    title: null,
    books: [],
  });
  const [otherInfo, setOtherInfo] = useState({
    isOwner: null,
    following: null,
    followRequestSent: null,
  });
  const [userListModal, setUserListModal] = useState({
    isOpen: false,
    title: null,
    users: null,
  });
  const [notificationInfo, setNotificationInfo] = useState({
    isVisible: false,
    content: '',
  });

  const [selectedPost, setSelectedPost] = useState(null);
  const [addToListInfo, setAddToListInfo] = useState({
    isOpen: false,
    postId: null,
    loggedInUserBookId: null,
    loggedInUserBookStatus: null,
  });

  const handleBookListPreviewClick = (e) => {
    const { title, status } = e.currentTarget.dataset;
    const bookList = user.books.filter((book) => book.status === status);
    if (bookList.length === 0) {
      setNotificationInfo({
        isVisible: true,
        content: `This list doesn't have any books yet`,
      });
      setTimeout(
        () => setNotificationInfo({ isVisible: false, content: '' }),
        2000,
      );
      return;
    }
    setBookListInfo({
      title,
      books: bookList,
    });
  };

  const { isAuthenticated, loading } = useAuth();

  const handleCloseModal = () => {
    setUserListModal({ isOpen: false, title: null, users: null });
  };

  const handleFollowClick = async () => {
    if (!isAuthenticated) {
      setNotificationInfo({
        isVisible: true,
        content: 'Must be logged in to interact with user',
      });
      setTimeout(
        () => setNotificationInfo({ isVisible: false, content: '' }),
        2000,
      );
    } else {
      if (otherInfo.following) {
        // confirm unfollow modal
      } else if (otherInfo.followRequestSent) {
        const res = await cancelFollowRequest(user.id);
        setOtherInfo((prev) => ({ ...prev, followRequestSent: false }));
        console.log(res);
      } else if (!otherInfo.following && !otherInfo.followRequestSent) {
        const res = await sendFollowRequest(user.id);
        setOtherInfo((prev) => ({ ...prev, followRequestSent: true }));
        console.log(res);
        try {
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (userIdParam) {
        const userId = parseInt(userIdParam);
        try {
          const data = await fetchUserProfile(userId);
          setUser(data.user);
          setOtherInfo({
            isOwner: data.isOwner,
            following: data.following,
            followRequestSent: data.followRequestSent,
          });
          console.log(data);
          setIsOwner(data.isOwner);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchProfile();
  }, [userIdParam]);

  const handleFollowerFollowingClick = (e) => {
    const { value } = e.currentTarget.dataset;

    if (value === 'followers')
      setUserListModal({
        isOpen: true,
        title: 'followers',
        users: user.followers,
      });
    if (value === 'following')
      setUserListModal({
        isOpen: true,
        title: 'following',
        users: user.following,
      });
  };

  return (
    user && (
      <>
        <div className={styles.profile}>
          <div className={styles.top}>
            <h1>
              {user.firstName} {user.lastName}
            </h1>
            <img
              src={user.profilePictureUrl}
              alt={`${user.firstName} ${user.lastName} profile picture`}
            />
            {!otherInfo.isOwner && (
              <button onClick={handleFollowClick}>
                {otherInfo.following
                  ? 'Following'
                  : otherInfo.followRequestSent
                    ? 'Follow Request Sent'
                    : 'Follow'}
              </button>
            )}
          </div>
          <div className={styles.followerFollowing}>
            {/* make these onClick to open modal of followers */}
            <div data-value="followers" onClick={handleFollowerFollowingClick}>
              <strong>{user.followers.length}</strong>
              <small>
                {user.followers.length === 1 ? 'Follower' : 'Followers'}
              </small>
            </div>
            <div data-value="following" onClick={handleFollowerFollowingClick}>
              {' '}
              <strong>{user.following.length}</strong>
              <small>Following</small>
            </div>
          </div>
          <div className={styles.lists}>
            {/* perhaps make these components */}
            {/* these will link to a seperate lists page */}

            <div
              className={styles.bookListPreview}
              data-title="Read"
              data-status="FINISHED"
              onClick={handleBookListPreviewClick}
            >
              <p>Read</p>
              <p>
                {user.books.filter((book) => book.status === 'FINISHED').length}
              </p>
            </div>
            <div
              className={styles.bookListPreview}
              data-title="Want to Read"
              data-status="WANT_TO_READ"
              onClick={handleBookListPreviewClick}
            >
              <p>Want to Read</p>
              <p>
                {
                  user.books.filter((book) => book.status === 'WANT_TO_READ')
                    .length
                }
              </p>
            </div>
            <div
              className={styles.bookListPreview}
              data-title="Currently Reading"
              data-status="CURRENTLY_READING"
              onClick={handleBookListPreviewClick}
            >
              <p>Currently Reading</p>
              <p>
                {
                  user.books.filter(
                    (book) => book.status === 'CURRENTLY_READING',
                  ).length
                }
              </p>
            </div>
            <div
              className={styles.bookListPreview}
              data-title="Did Not Finish"
              data-status="DID_NOT_FINISH"
              onClick={handleBookListPreviewClick}
            >
              <p>Did Not Finish</p>
              <p>
                {
                  user.books.filter((book) => book.status === 'DID_NOT_FINISH')
                    .length
                }
              </p>
            </div>
          </div>
          <div className={styles.userActivity}>
            <div className={styles.header}>
              <img src="" alt="" />
              <p>Recent Activity</p>
            </div>
            <div className={styles.recentBooks}>
              {user.books.map((post) => (
                <PostPreview
                  key={post.id}
                  post={post}
                  setSelectedPost={setSelectedPost}
                  setNotificationInfo={setNotificationInfo}
                  onFeed={true}
                  isAuthenticated={isAuthenticated}
                  setAddToListInfo={setAddToListInfo}
                />
              ))}
            </div>
          </div>
        </div>
        {userListModal.isOpen && (
          <UserListModal
            title={userListModal.title}
            users={userListModal.users}
            handleClose={handleCloseModal}
          />
        )}
        {notificationInfo.isVisible && (
          <Notification content={notificationInfo.content} type="alert" />
        )}
        {bookListInfo.books.length > 0 && (
          <BookList
            title={bookListInfo.title}
            books={bookListInfo.books}
            setBookListInfo={setBookListInfo}
          />
        )}
      </>
    )
  );
};

export default UserProfile;
