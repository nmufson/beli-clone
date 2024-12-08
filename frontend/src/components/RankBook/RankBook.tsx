import { useState } from 'react';
import styles from './RankBook.module.css';
import CheckIcon from '../icons/CheckIcon';

const RankBook = ({ book }) => {
  const { title, author, genre } = book;

  const [initialThoughtsOpen, setInitialThoughtsOpen] = useState(true);
  const [reactionButtonInfo, setReactionButtonInfo] = useState({
    isDisabled: false,
    selected: null,
  });

  const handleClickReactionButton = (e) => {
    const { value } = e.target;
    setReactionButtonInfo((prev) => ({ ...prev, selected: value }));
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
                onClick={handleClickReactionButton}
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
                onClick={handleClickReactionButton}
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
                onClick={handleClickReactionButton}
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
              <p>I didn't like it!</p>
            </div>
          </div>
        </div>
        {initialThoughtsOpen ? (
          <div className={styles.addNoteContainer}>
            <label htmlFor="">Add a note (optional)</label>
            <textarea name="" id=""></textarea>
          </div>
        ) : (
          <div className={`${styles.pairwiseComparison} modal`}></div>
        )}
      </div>
    </>
  );
};

export default RankBook;
