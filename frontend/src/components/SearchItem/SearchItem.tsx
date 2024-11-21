import styles from './SearchItem.module.css';
import BookIcon from '../icons/BookIcon';
import PlusCircleOutlineIcon from '../icons/PlusCircleOutlineIcon';
import BookmarkIcon from '../icons/BookmarkIcon';
import { useNavigate } from 'react-router-dom';
import createSlug from '../../utils/createSlug';
import { ContextHandlerImpl } from 'express-validator/lib/chain';

const SearchItem = ({ bookItem }) => {
  const volume = bookItem.volumeInfo;
  const slug = createSlug(volume.title);
  const updatedVolume = { ...volume, slug };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/book/${updatedVolume.slug}`);
  };

  return (
    <div className={styles.searchItem} onClick={handleClick}>
      <BookIcon />
      <div className={styles.infoContainer}>
        <p>{volume.title}</p>
        {volume.authors && <small>{volume.authors[0]}</small>}
      </div>

      <div className={styles.addContainer}>
        <PlusCircleOutlineIcon />
        <BookmarkIcon />
      </div>
    </div>
  );
};

export default SearchItem;
