import { useParams } from 'react-router-dom';
import styles from './Book.module.css';
import { useEffect, useState } from 'react';
import searchBook from '../../services/googleBookService';

const Book = () => {
  const [book, setBook] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await searchBook(slug);
        console.log(data);
        setBook(data.items[0]);
      } catch (error) {
        console.log(error, 'failed to fetch book');
      }
    };
    fetchBook();
  }, []);

  return (
    <div>
      <p></p>
      {book && <p> {book.volumeInfo.title}</p>}
    </div>
  );
};

export default Book;
