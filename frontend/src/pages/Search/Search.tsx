import { searchBook } from '../../services/googleBookService';
import SearchItem from '../../components/SearchItem/SearchItem';
import { useState } from 'react';
import styles from './Search.module.css';

const Search = () => {
  const [searchItems, setSearchItems] = useState([]);

  // perhaps only bring a few fields here and then later fetch the whole
  // thing on the book specific page
  const onChange = async (e) => {
    try {
      const books = await searchBook(e.target.value);

      setSearchItems(books);
    } catch (error) {
      console.error('Error fetching books:', error.message);
    }
  };
  return (
    <div>
      <input type="text" onChange={onChange} />
      <div className={styles.resultsContainer}>
        {searchItems.length > 0 &&
          searchItems
            .slice(0, Math.min(searchItems.length, 5))
            .map((item) => <SearchItem key={item.id} book={item} />)}
      </div>
    </div>
  );
};

export default Search;
