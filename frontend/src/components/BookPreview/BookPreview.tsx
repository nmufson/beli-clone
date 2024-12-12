import styles from './BookPreview.module.css';
import createSlug from '../../utils/createSlug';
import { Link } from 'react-router-dom';

const BookPreview = ({ book }) => {
  return (
    <div key={book.id} className={styles.bookPreview}>
      <Link to={`/book/${book.googleBooksId}/${createSlug(book.title)}`}>
        <img src={book.imageUrl} alt={`${book.title} thumbnail`} />
      </Link>

      <div className={styles.bookInfo}>
        <div className={styles.titleAuthor}>
          <Link to={`/book/${book.googleBooksId}/${createSlug(book.title)}`}>
            {book.title}
          </Link>

          <small>{book.author}</small>
        </div>
        <p>{book.genre}</p>
      </div>
    </div>
  );
};

export default BookPreview;
