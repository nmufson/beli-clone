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
  const [rankBookOpen, setRankBookOpen] = useState(false);

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
    if (selectedOption === 'FINISHED') {
      console.log('yo');
      setRankBookOpen(true);
      // later we can either add new book or update from reading to finished
    } else {
      if (!loggedInUserBookId && selectedOption !== 'NONE') {
        try {
          const res = await addBookToShelf(selectedPost, selectedOption);
          const { addedBook } = res;
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
              loggedInUserBookStatus,
              loggedInUserBookId,
              selectedOption,
            );
            console.log(updatedBook);
          }
        } catch (error) {
          console.log(error);
        }
      }
      handleCloseModal();
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
        <RankBook
          book={selectedPost}
          setAddToListInfo={setAddToListInfo}
          setPost={setPost}
          setPosts={setPosts}
          onFeed={onFeed}
          postId={postId}
        />
      )}

      <div className="backdrop" onClick={handleCloseModal}></div>
    </>
  );
};

export default AddToList;
