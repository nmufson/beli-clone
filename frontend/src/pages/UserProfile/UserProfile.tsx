import { useParams } from 'react-router-dom';
import styles from './UserProfile.module.css';
import { fetchUserProfile } from '../../services/userService';
import { useEffect, useState } from 'react';
import PostPreview from '../../components/PostPreview/PostPreview';
import UserListModal from '../../components/UserListModal/UserListModal';
import useAuth from '../../hooks/useAuth';
import Notification from '../../components/Notifcation/Notification';
import { unfollowUser } from '../../services/userService';
import {
  sendFollowRequest,
  cancelFollowRequest,
} from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import BookList from '../../components/BookList/BookList';
import ConfirmModal from '../../components/UnfollowModal/UnfollowModal';
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
  const navigate = useNavigate();
  const { userIdParam } = useParams();
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [otherInfo, setOtherInfo] = useState({
    isOwner: false,
    following: false,
    followRequestSent: false,
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

  const [confirmModalInfo, setConfirmModalInfo] = useState({
    isOpen: false,
    title: '',
    content: '',
    cancelButtonContent: '',
    confirmButtonContent: '',
    onConfirm: null,
  });

  const [selectedPost, setSelectedPost] = useState(null);
  const [addToListInfo, setAddToListInfo] = useState({
    isOpen: false,
    postId: null,
    loggedInUserBookId: null,
    loggedInUserBookStatus: null,
  });

  const handleBookListClick = (e) => {
    const { status } = e.currentTarget.dataset;

    navigate(`/lists/user/${user.id}`, { state: { status } });
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
        setConfirmModalInfo({
          isOpen: true,
          title: 'Unfollow User',
          content: `Are you sure you want to unfollow ${user.firstName} ${user.lastName}?`,
          cancelButtonContent: 'Cancel',
          confirmButtonContent: 'Unfollow',
          onConfirm: handleConfirmUnfollowClick,
        });
      } else if (otherInfo.followRequestSent) {
        setConfirmModalInfo({
          isOpen: true,
          title: 'Cancel Follow Request',
          cancelButtonContent: 'Close',
          content: `Are you sure you want to cancel your follow request?`,
          confirmButtonContent: 'Cancel Request',
          onConfirm: handleConfirmCancelFollowRequestClick,
        });
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

  const handleConfirmUnfollowClick = async () => {
    try {
      await unfollowUser(user.id);
      setOtherInfo((prev) => ({
        ...prev,
        following: false,
      }));
      setConfirmModalInfo((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmCancelFollowRequestClick = async () => {
    try {
      await cancelFollowRequest(user.id);
      setOtherInfo((prev) => ({
        ...prev,
        followRequestSent: false,
      }));
      setConfirmModalInfo((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.log(error);
    }
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

            <div
              className={styles.bookListPreview}
              data-title="Read"
              data-status="FINISHED"
              onClick={handleBookListClick}
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
              onClick={handleBookListClick}
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
              onClick={handleBookListClick}
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
              onClick={handleBookListClick}
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

        {confirmModalInfo.isOpen && (
          <ConfirmModal
            setConfirmModalInfo={setConfirmModalInfo}
            handleConfirm={confirmModalInfo.onConfirm}
            title={confirmModalInfo.title}
            content={confirmModalInfo.content}
            cancelButtonContent={confirmModalInfo.cancelButtonContent}
            confirmButtonContent={confirmModalInfo.confirmButtonContent}
          />
        )}
      </>
    )
  );
};

export default UserProfile;
