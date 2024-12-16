import { useEffect, useState } from 'react';
import styles from './Feed.module.css';
import {
  useParams,
  useSearchParams,
  useNavigate,
  useOutletContext,
  Link,
} from 'react-router-dom';
import { fetchPosts } from '../../services/feedService';
import PostPreview from '../../components/PostPreview/PostPreview';
import UserListModal from '../../components/UserListModal/UserListModal';
import Alert from '../../components/Alert/Alert';
import useAuth from '../../hooks/useAuth';
import AddToList from '../../components/AddToList/AddToList';
import MagnifyIcon from '../../components/icons/MagnifyIcon';

const Feed = () => {
  const [posts, setPosts] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [notificationInfo, setNotificationInfo] = useState({
    isVisible: false,
    content: null,
  });
  // clean this up
  const [addToListInfo, setAddToListInfo] = useState({
    isOpen: false,
    postId: null,
    loggedInUserBookId: null,
    loggedInUserBookStatus: null,
  });

  const navigate = useNavigate();
  const { isAuthenticated, loading } = useOutletContext();
  const { type } = useParams();

  useEffect(() => {
    if (isAuthenticated && type === 'guest') {
      navigate('/feed/user');
    } else if (!isAuthenticated && type === 'user') {
      navigate('/feed/guest');
    }
  }, [isAuthenticated, navigate]);

  const [modalLikes, setModalLikes] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPosts(type);
        const booksData = data.feedBooks;
        setPosts(booksData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [type]);

  if (loading) {
    return <div>loading...</div>;
  }

  // filter only the ones with hasPost === true
  // probably do this on backend
  return (
    <>
      <div className={styles.feed}>
        <Link to="/search">
          <div className={styles.search}>
            <MagnifyIcon />
            <p>Search a book title or author.</p>
          </div>
        </Link>
        <h1>YOUR FEED</h1>
        <div className={styles.posts}>
          {posts?.map((post) => (
            <PostPreview
              key={post.id}
              post={post}
              setSelectedPost={setSelectedPost}
              setModalLikes={setModalLikes}
              setNotificationInfo={setNotificationInfo}
              onFeed={true}
              isAuthenticated={isAuthenticated}
              setAddToListInfo={setAddToListInfo}
            />
          ))}
        </div>
      </div>
      {modalLikes && (
        <UserListModal
          title="likes"
          likes={modalLikes}
          setLikes={setModalLikes}
        />
      )}
      {notificationInfo.isVisible && (
        <Alert content={notificationInfo.content} type="alert" />
      )}
      {addToListInfo.isOpen && (
        <AddToList
          loggedInUserBookStatus={addToListInfo.loggedInUserBookStatus}
          loggedInUserBookId={addToListInfo.loggedInUserBookId}
          setAddToListInfo={setAddToListInfo}
          postId={addToListInfo.postId}
          onFeed={true}
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
          posts={posts}
          setPosts={setPosts}
        />
      )}
    </>
  );
};

export default Feed;
