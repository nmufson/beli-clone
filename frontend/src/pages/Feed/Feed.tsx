import { useEffect, useState } from 'react';
import styles from './Feed.module.css';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchPosts } from '../../services/postsService';
import PostPreview from '../../components/PostPreview/PostPreview';

const Feed = () => {
  const [posts, setPosts] = useState(null);
  const { type } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPosts(type);
        const postsData = data.posts;
        setPosts(postsData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [type]);

  return (
    <div>
      <p>YOUR FEED</p>
      <div className={styles.posts}>
        {posts?.map((post) => (
          <PostPreview
            key={post.id}
            googleBooksId={post.googleBooksId}
            userId={post.userId}
            userFirstName={post.userFirstName}
            userLastName={post.userLastName}
            title={post.bookName}
            author={post.bookAuthor}
            userProfilePicUrl={post.userProfilePictureUrl}
            rating={post.userRating}
            note={post.userNote}
            status={post.status}
            createdAt={post.createdAt}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;
