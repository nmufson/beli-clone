import styles from './BookList.module.css';
import CloseIcon from '../icons/CloseIcon';
import createSlug from '../../utils/createSlug';
import { Link } from 'react-router-dom';

const bookList = ({ title, books, setBookListInfo }) => {
  const handleCloseModal = () => {
    setBookListInfo({
      title: null,
      books: [],
    });
  };

  return (
    <>
      <div className={`${styles.bookList} modal`}>
        <div className={styles.topContainer}>
          <h3>{title}</h3>
          <CloseIcon handleClose={handleCloseModal} />
        </div>

        <div className={styles.books}>
          {books.map((book) => (
            <div key={book.id} className={styles.bookItem}>
              <img src={book.imageUrl} alt={`${book.title} thumbnail`} />
              <div className={styles.bookInfo}>
                <div className={styles.titleAuthor}>
                  <Link
                    to={`/book/${book.googleBooksId}/${createSlug(book.title)}`}
                  >
                    {book.title}
                  </Link>

                  <small>{book.author}</small>
                </div>
                <p>{book.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="backdrop" onClick={handleCloseModal}></div>
    </>
  );
};

export default bookList;
