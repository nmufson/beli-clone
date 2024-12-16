import styles from './Lists.module.css';
import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchUserBookLists } from '../../services/userBookService';
import createSlug from '../../utils/createSlug';
import BookPreview from '../../components/BookPreview/BookPreview';

const Lists = () => {
  const { userIdParam } = useParams();
  const [books, setBooks] = useState({});

  const location = useLocation();

  const [selectedStatus, setSelectedStatus] = useState(
    (location.state && location.state.status) || '',
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookLists = async () => {
      if (userIdParam) {
        try {
          const data = await fetchUserBookLists(userIdParam);
          setBooks(data.books);

          if (!selectedStatus) {
            if (data.books['FINISHED'].legnth !== 0) {
              setSelectedStatus('FINISHED');
            } else if (data.books['WANT_TO_READ'].legnth !== 0) {
              setSelectedStatus('WANT_TO_READ');
            } else if (data.books['CURRENTLY_READING'].legnth !== 0) {
              setSelectedStatus('CURRENTLY_READING');
            } else if (data.books['DID_NOT_FINISH'].legnth !== 0) {
              setSelectedStatus('DID_NOT_FINISH');
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBookLists();
  }, [userIdParam]);

  const handleStatusClick = (e) => {
    const { value } = e.target;
    setSelectedStatus(value);
  };

  loading && <div>Loading...</div>;

  return (
    // add options to change sorting order??
    <div className={styles.list}>
      <h1>Lists</h1>
      <div className={styles.statusContainer}>
        <button
          value="FINISHED"
          onClick={handleStatusClick}
          className={selectedStatus === 'FINISHED' ? styles.selected : ''}
        >
          Read
        </button>
        <button
          value="WANT_TO_READ"
          onClick={handleStatusClick}
          className={selectedStatus === 'WANT_TO_READ' ? styles.selected : ''}
        >
          Want to Read
        </button>
        <button
          value="CURRENTLY_READING"
          onClick={handleStatusClick}
          className={
            selectedStatus === 'CURRENTLY_READING' ? styles.selected : ''
          }
        >
          Reading
        </button>
        <button
          value="DID_NOT_FINISH"
          onClick={handleStatusClick}
          className={selectedStatus === 'DID_NOT_FINISH' ? styles.selected : ''}
        >
          Did Not Finish
        </button>
      </div>
      <div className={styles.bookList}>
        {books[selectedStatus]?.length > 0 ? (
          books[selectedStatus].map((book) => (
            <BookPreview key={book.id} book={book} />
          ))
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          <p>No books yet.</p>
        )}
      </div>
    </div>
  );
};

export default Lists;
