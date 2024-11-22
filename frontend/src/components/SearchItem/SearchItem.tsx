import styles from './SearchItem.module.css';
import BookIcon from '../icons/BookIcon';
import PlusCircleOutlineIcon from '../icons/PlusCircleOutlineIcon';
import BookmarkIcon from '../icons/BookmarkIcon';
import { useNavigate } from 'react-router-dom';
import createSlug from '../../utils/createSlug';
import { ContextHandlerImpl } from 'express-validator/lib/chain';

const SearchItem = ({ book }) => {
  const slug = createSlug(book.title);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/book/${book.googleBooksId}/${slug}`, { state: { book } });
  };

  return (
    <div className={styles.searchItem} onClick={handleClick}>
      <BookIcon />
      <div className={styles.infoContainer}>
        <p>{book.title}</p>
        {book.author && <small>{book.author}</small>}
      </div>

      <div className={styles.addContainer}>
        <PlusCircleOutlineIcon />
        <BookmarkIcon />
      </div>
    </div>
  );
};

export default SearchItem;
