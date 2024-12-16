import { searchBook } from '../../services/googleBookService';
import SearchItem from '../../components/SearchItem/SearchItem';
import { useEffect, useState, useRef } from 'react';
import styles from './Search.module.css';
import { useParams } from 'react-router-dom';
import MagnifyIcon from '../../components/icons/MagnifyIcon';

const Search = () => {
  const [searchItems, setSearchItems] = useState([]);
  const [query, setQuery] = useState('');
  const { authorSlug } = useParams();
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchSlugBooks = async () => {
      if (authorSlug) {
        setQuery(authorSlug);
        try {
          const books = await searchBook(authorSlug);

          setSearchItems(books);
        } catch (error) {
          console.error('Error fetching books:', error.message);
        }
      }
    };
    fetchSlugBooks();
  }, [authorSlug]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() !== '') {
      try {
        const books = await searchBook(value);
        setSearchItems(books);
      } catch (error) {
        console.error('Error fetching books:', error.message);
      }
    } else {
      setSearchItems([]);
    }
  };

  return (
    <div className={styles.search}>
      <div className={styles.searchContainer}>
        <MagnifyIcon />
        <input
          type="text"
          value={query}
          onChange={onChange}
          placeholder="Search for books..."
          ref={inputRef}
        />
      </div>

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
