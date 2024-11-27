import { searchBook } from '../../services/googleBookService';
import SearchItem from '../../components/SearchItem/SearchItem';
import { useEffect, useState } from 'react';
import styles from './Search.module.css';
import { useParams } from 'react-router-dom';

const Search = () => {
  const [searchItems, setSearchItems] = useState([]);
  const [query, setQuery] = useState('');
  const { authorSlug } = useParams();

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
    <div>
      <input
        type="text"
        value={query}
        onChange={onChange}
        placeholder="Search for books..."
      />
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
