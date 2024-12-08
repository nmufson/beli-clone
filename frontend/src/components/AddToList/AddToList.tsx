/* add backend for this part first

Want to Read 
Currently Reading 
Finished
Did not finish*/
import { useState } from 'react';
import styles from './AddToList.module.css';
import AddToListItem from './AddToListItem';
import {
  addBookToShelf,
  removeBookFromShelf,
  updateShelf,
} from '../../services/feedService';
import RankBook from '../RankBook/RankBook';

const AddToList = ({
  loggedInUserBookStatus,
  loggedInUserBookId,
  setAddToListInfo,
  onFeed,
  postId,
  setSelectedPost = (prev) => {},
  selectedPost,
  posts = [],
  setPosts = (prev) => {},
  setPost = (prev) => {},
}) => {
  const [selectedOption, setSelectedOption] = useState(
    loggedInUserBookStatus || 'NONE',
  );
  const [rankBookOpen, setRankBookOpen] = useState(true);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCloseModal = () => {
    if (onFeed) {
      setSelectedPost(null);
    }
    setAddToListInfo({
      isOpen: false,
      loggedInUserBookId: null,
      loggedInUserBookStatus: null,
    });
  };

  // make it so if findished, asks to rank the book
  const handleSave = async () => {
    if (!loggedInUserBookId) {
      try {
        const newBook = await addBookToShelf(selectedPost, selectedOption);
        console.log(newBook);
      } catch (error) {
        console.log(error);
      }
    }
    if (loggedInUserBookId && loggedInUserBookStatus !== selectedOption) {
      try {
        if (selectedOption === 'NONE') {
          await removeBookFromShelf(loggedInUserBookId);
        } else {
          const updatedBook = await updateShelf(
            loggedInUserBookId,
            selectedOption,
          );
          console.log(updatedBook);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (!onFeed) {
      setPost((prev) => ({
        ...prev,
        loggedInUserBookStatus:
          selectedOption === 'NONE' ? null : selectedOption,
        loggedInUserBookId:
          selectedOption === 'NONE' ? null : loggedInUserBookId,
      }));
    } else {
      console.log(postId);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                loggedInUserBookStatus:
                  selectedOption === 'NONE' ? null : selectedOption,
                loggedInUserBookId:
                  selectedOption === 'NONE' ? null : loggedInUserBookId,
              }
            : post,
        ),
      );
    }
    handleCloseModal();
  };

  return (
    <>
      {!rankBookOpen ? (
        <div className={`${styles.addToListContainer} modal`}>
          <div className={styles.topContainer}>
            <button onClick={handleCloseModal}>Cancel</button>
            <p>Add or remove from list</p>
            <button onClick={handleSave}>Save</button>
          </div>
          <div className={styles.optionsContainer}>
            <AddToListItem
              value="WANT_TO_READ"
              label="Want to Read"
              selectedOption={selectedOption}
              handleChange={handleChange}
            />
            <AddToListItem
              value="CURRENTLY_READING"
              label="Currently Reading"
              selectedOption={selectedOption}
              handleChange={handleChange}
            />
            <AddToListItem
              value="FINISHED"
              label="Finished"
              selectedOption={selectedOption}
              handleChange={handleChange}
            />
            <AddToListItem
              value="DID_NOT_FINISH"
              label="Did Not Finish"
              selectedOption={selectedOption}
              handleChange={handleChange}
            />
            <AddToListItem
              value="NONE"
              label="None"
              selectedOption={selectedOption}
              handleChange={handleChange}
            />
          </div>
        </div>
      ) : (
        <RankBook book={selectedPost} />
      )}

      <div className="backdrop" onClick={handleCloseModal}></div>
    </>
  );
};

export default AddToList;
