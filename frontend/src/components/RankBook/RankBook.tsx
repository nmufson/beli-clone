import { useState } from 'react';
import styles from './RankBook.module.css';
import CheckIcon from '../icons/CheckIcon';
import {
  addFinishedBook,
  sendComparisonResults,
} from '../../services/userBookService';

type PairwiseResult = {
  winnerId: number;
  loserId: number;
};

const RankBook = ({
  book,
  setAddToListInfo,
  setPost,
  setPosts,
  onFeed,
  postId,
}) => {
  const { title, author, genre } = book;
  const [addedBookId, setAddedBookId] = useState(null);

  //probably consolidate these

  const [initialThoughtsOpen, setInitialThoughtsOpen] = useState(true);
  const [pairwiseComparisonOpen, setPairwiseComparisonOpen] = useState(false);
  const [reactionButtonInfo, setReactionButtonInfo] = useState({
    isDisabled: false,
    selected: null,
  });

  const [compareBooks, setCompareBooks] = useState({ books: [], index: 0 });
  const [userNote, setUserNote] = useState(null);
  const [orderedBooks, setOrderedBooks] = useState([]);

  const handleReactionButtonClick = (e) => {
    const { value } = e.target;
    setReactionButtonInfo((prev) => ({ ...prev, selected: value }));
  };

  // add dompurify
  const handleNoteChange = (e) => {
    const { value } = e.target;
    setUserNote(value.trim());
  };

  const handleNextClick = async () => {
    if (reactionButtonInfo.selected) {
      try {
        const res = await addFinishedBook(
          book,
          userNote,
          reactionButtonInfo.selected,
        );
        const { addedBook } = res;
        setAddedBookId(addedBook.id);
        if (!onFeed) {
          setPost((prev) => ({
            ...prev,
            loggedInUserBookStatus: 'FINISHED',
            loggedInUserBookId: addedBook.id,
          }));
        } else {
          setPosts((prev) =>
            prev.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    loggedInUserBookStatus: 'FINISHED',
                    loggedInUserBookId: addedBook.id,
                  }
                : post,
            ),
          );
        }

        if (res.comparableBooks) {
          setInitialThoughtsOpen(false);
          setPairwiseComparisonOpen(true);
          const bookList = res.comparableBooks;
          // Initialize orderedBooks with the initial book list
          setOrderedBooks(bookList.map((book) => book.id));
          // do we need to set the order books at the beginning
          setCompareBooks({
            books: bookList,
            index: Math.floor(bookList.length / 2),
          });
        } else {
          setAddToListInfo({
            isOpen: false,
            loggedInUserBookId: null,
            loggedInUserBookStatus: null,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleBookClick = async (e) => {
    const { value } = e.currentTarget;
    const valueInt = parseInt(value);

    let newOrderedBooks = [...orderedBooks];
    const currentBookId = compareBooks.books[compareBooks.index].id;

    const addedBookIndex = newOrderedBooks.indexOf(addedBookId);
    if (addedBookIndex !== -1) {
      newOrderedBooks.splice(addedBookIndex, 1);
    }

    const currentBookIndex = newOrderedBooks.indexOf(currentBookId);
    if (valueInt === addedBookId) {
      newOrderedBooks.splice(currentBookIndex + 1, 0, addedBookId);
    } else {
      newOrderedBooks.splice(currentBookIndex, 0, addedBookId);
    }

    setOrderedBooks(newOrderedBooks);

    const rightSideBooks = compareBooks.books.slice(compareBooks.index + 1);
    const leftSideBooks = compareBooks.books.slice(0, compareBooks.index);

    if (
      (valueInt === addedBookId && rightSideBooks.length === 0) ||
      (valueInt !== addedBookId && leftSideBooks.length === 0)
    ) {
      console.log(newOrderedBooks);
      try {
        const result = await sendComparisonResults(
          addedBookId,
          reactionButtonInfo.selected,
          newOrderedBooks,
        );

        console.log(result);
        // Display some success notification here
        setAddToListInfo({
          isOpen: false,
          loggedInUserBookId: null,
          loggedInUserBookStatus: null,
        });
      } catch (error) {
        console.log(error);
      }
      return;
    }

    if (valueInt === addedBookId) {
      setCompareBooks({
        books: rightSideBooks,
        index: Math.floor(rightSideBooks.length / 2),
      });
    } else {
      setCompareBooks({
        books: leftSideBooks,
        index: Math.floor(leftSideBooks.length / 2),
      });
    }
  };

  // make the button wrappers into components
  return (
    <>
      <div className={`${styles.initialThoughts} modal`}>
        <div className={styles.bookInfo}>
          <strong>{title}</strong>
          <small>
            {author} | {genre}
          </small>
        </div>
        <div className={styles.reaction}>
          <p>What did you think?</p>
          <div className={styles.buttonContainer}>
            <div className={styles.buttonWrapper}>
              <button
                value="LIKED"
                onClick={handleReactionButtonClick}
                className={
                  reactionButtonInfo.selected === 'LIKED' ? styles.selected : ''
                }
                disabled={reactionButtonInfo.isDisabled}
              >
                {reactionButtonInfo.selected === 'LIKED' ? <CheckIcon /> : ''}
              </button>
              <p>I liked it!</p>
            </div>
            <div className={styles.buttonWrapper}>
              <button
                value="OKAY"
                onClick={handleReactionButtonClick}
                className={
                  reactionButtonInfo.selected === 'OKAY' ? styles.selected : ''
                }
                disabled={reactionButtonInfo.isDisabled}
              >
                {' '}
                {reactionButtonInfo.selected === 'OKAY' ? <CheckIcon /> : ''}
              </button>
              <p>It was okay</p>
            </div>
            <div className={styles.buttonWrapper}>
              <button
                value="DISLIKED"
                onClick={handleReactionButtonClick}
                className={
                  reactionButtonInfo.selected === 'DISLIKED'
                    ? styles.selected
                    : ''
                }
                disabled={reactionButtonInfo.isDisabled}
              >
                {reactionButtonInfo.selected === 'DISLIKED' ? (
                  <CheckIcon />
                ) : (
                  ''
                )}
              </button>
              <p>I didn't like it</p>
            </div>
          </div>
        </div>
        {initialThoughtsOpen && (
          <>
            <div className={styles.addNoteContainer}>
              <label htmlFor="note">Add a note (optional)</label>
              <textarea
                onChange={handleNoteChange}
                value={userNote || ''}
                name="note"
                id="note"
              ></textarea>
            </div>
            <button className={styles.nextButton} onClick={handleNextClick}>
              Next
            </button>
          </>
        )}
        {pairwiseComparisonOpen && (
          <div className={`${styles.pairwiseComparison} modal`}>
            <p>Which did you prefer?</p>
            <div className={styles.comparisonBooks}>
              <button value={addedBookId} onClick={handleBookClick}>
                <strong>{title}</strong>
                <small>{author}</small>
              </button>
              <p>OR</p>
              <button
                value={compareBooks.books[compareBooks.index].id}
                onClick={handleBookClick}
              >
                <strong>{compareBooks.books[compareBooks.index].title}</strong>
                <small>{compareBooks.books[compareBooks.index].author}</small>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RankBook;
