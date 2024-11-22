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

const Book = () => {
  const location = useLocation();
  console.log(location);
  const [book, setBook] = useState(location?.state?.book || null);
  const [showModal, setShowModal] = useState(false);

  const { bookId } = useParams();

  useEffect(() => {
    if (!book && bookId) {
      const fetchBook = async () => {
        try {
          const data = await fetchBookById(bookId);
          setBook(data);
        } catch (error) {
          console.error('Failed to fetch book:', error);
        }
      };
      fetchBook();
    }
  }, [book, bookId]);

  const handleAddClick = () => {
    setShowModal(true);
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

            <div className={styles.addBook}>
              <p>Want to Read</p>

              <MenuDown handleAddClick={handleAddClick} />
            </div>
            <div>
              <p>Description:</p>
              <p>{book.description}</p>
            </div>
          </div>
        </div>
      )}
      {showModal && <AddToList />}
    </>
  );
};

export default Book;
