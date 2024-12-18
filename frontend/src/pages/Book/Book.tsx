import { useLocation, useParams } from 'react-router-dom';
import {
  fetchBookById,
  searchBookOpenLib,
} from '../../services/googleBookService';
import styles from './Book.module.css';
import { useEffect, useState } from 'react';
import roundDownToDecimal from '../../utils/roundDownToDecimal';
import MenuDown from '../../components/icons/MenuDown';
import AddToList from '../../components/AddToList/AddToList';
import { fetchBookByGoogleId } from '../../services/bookService';
import useAuth from '../../hooks/useAuth';
import CheckMarkIcon from '../../components/icons/CheckMarkIcon';

const Book = () => {
  const location = useLocation();

  const [book, setBook] = useState(location?.state?.book || null);
  const [userBook, setUserBook] = useState(null);
  const { isAuthenticated, loading } = useAuth();
  const [addToListInfo, setAddToListInfo] = useState({ isOpen: false });
  const { googleBooksId } = useParams();

  useEffect(() => {
    if (!book && googleBooksId) {
      const fetchBook = async () => {
        try {
          const data = await fetchBookById(googleBooksId);
          setBook(data);
        } catch (error) {
          console.error('Failed to fetch book:', error);
        }
      };
      fetchBook();
    }
  }, [book, googleBooksId]);

  useEffect(() => {
    const fetchUserBookStatus = async () => {
      try {
        if (googleBooksId && isAuthenticated) {
          const data = await fetchBookByGoogleId(googleBooksId);
          if (data.userBook) {
            setUserBook(data.userBook);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserBookStatus();
  }, [googleBooksId, book]);

  const handleAddClick = () => {
    setAddToListInfo((prev) => ({ ...prev, isOpen: true }));
  };

  if (!book) return <p>loading...</p>;

  return (
    <>
      {book && (
        <div className={styles.bookContainer}>
          <div className={styles.imageContainer}>
            <img src={book.imageURL} alt={book.title} />
            <div>
              <p>{book.genre}</p>
            </div>
          </div>
          <div className={styles.bottomContainer}>
            <h1>{book.title}</h1>
            <p>by {book.author}</p>
            <div className={styles.ratings}>
              <p>{book.rating}/5.00 stars</p>
              <p>
                {book.ratingCount}{' '}
                {book.ratingCount === 1 ? 'Rating' : 'Ratings'}
              </p>
            </div>

            <div className={styles.addBook} onClick={handleAddClick}>
              <p>
                {userBook?.status === 'FINISHED'
                  ? 'Finished'
                  : userBook?.status === 'CURRENTLY_READING'
                    ? 'Currently Reading'
                    : userBook?.status === 'WANT_TO_READ'
                      ? 'Want to Read'
                      : userBook?.status === 'DID_NOT_FINISH'
                        ? 'Did Not Finish'
                        : 'Add Book'}
              </p>

              {userBook?.status === 'FINISHED' ||
              userBook?.status === 'CURRENTLY_READING' ||
              userBook?.status === 'WANT_TO_READ' ? (
                <div className={styles.checkMark}>
                  <CheckMarkIcon />
                </div>
              ) : (
                <MenuDown handleAddClick={handleAddClick} />
              )}
            </div>
            <div>
              <p>Description:</p>
              <p>{book.description}</p>
            </div>
          </div>
        </div>
      )}
      {addToListInfo.isOpen && (
        <AddToList
          loggedInUserBookStatus={userBook.status}
          loggedInUserBookId={userBook.id}
          onFeed={false}
          selectedPost={book}
          setAddToListInfo={setAddToListInfo}
          // setPost={setPost}
        />
      )}
    </>
  );
};

export default Book;
