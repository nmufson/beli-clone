import { useEffect, useState } from 'react';
import styles from './Feed.module.css';
import {
  useParams,
  useSearchParams,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';
import { fetchPosts } from '../../services/feedService';
import PostPreview from '../../components/PostPreview/PostPreview';
import LikesModal from '../../components/LikesModal/LikesModal';
import Notification from '../../components/Notifcation/Notification';
import useAuth from '../../hooks/useAuth';
import AddToList from '../../components/AddToList/AddToList';

const Feed = () => {
  const [posts, setPosts] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [notificationInfo, setNotificationInfo] = useState({
    isVisible: false,
    content: null,
  });
  const [addToListInfo, setAddToListInfo] = useState({
    isOpen: false,
    postId: null,
    title: null,
    author: null,
    genre: null,
    imageUrl: null,
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
      <div>
        <p>YOUR FEED</p>
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
      {modalLikes && <LikesModal likes={modalLikes} setLikes={setModalLikes} />}
      {notificationInfo.isVisible && (
        <Notification content={notificationInfo.content} type="alert" />
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
