/* add backend for this part first

Want to Read 
Currently Reading 
Finished
Did not finish*/
import { useState } from 'react';
import styles from './AddToList.module.css';
import AddToListItem from './AddToListItem';
import { removeBookFromShelf, updateShelf } from '../../services/feedService';

const AddToList = ({
  loggedInUserBookStatus,
  loggedInUserBookId,
  setAddToListInfo,
  onFeed,
  postId,
  posts = [],
  setPosts = (prev) => {},
  setPost = (prev) => {},
}) => {
  const [selectedOption, setSelectedOption] = useState(
    loggedInUserBookStatus || 'NONE',
  );

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCloseModal = () => {
    setAddToListInfo({
      isOpen: false,
      loggedInUserBookId: null,
      loggedInUserBookStatus: null,
    });
  };

  const handleSave = async () => {
    if (loggedInUserBookStatus !== selectedOption) {
      try {
        if (selectedOption === 'NONE') {
          await removeBookFromShelf(loggedInUserBookId);
        } else {
          const updatedBook = await updateShelf(
            loggedInUserBookId,
            selectedOption,
          );
          console.log(updatedBook);
          if (!onFeed) {
            setPost((prev) => ({
              ...prev,
              loggedInUserBookStatus: selectedOption,
            }));
          } else {
            setPosts((prev) =>
              prev.map((post) =>
                post.id === postId
                  ? { ...post, loggedInUserBookStatus: selectedOption }
                  : post,
              ),
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    handleCloseModal();
  };

  return (
    <>
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
        <div>{/* inUserLibrary && remove from library button   */}</div>
      </div>
      <div className="backdrop" onClick={handleCloseModal}></div>
    </>
  );
};

export default AddToList;
