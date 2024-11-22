/* add backend for this part first

Want to Read 
Currently Reading 
Finished
Did not finish*/
import { useState } from 'react';
import styles from './AddToList.module.css';
import AddToListItem from './AddToListItem';

const AddToList = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className={styles.addToListContainer}>
      <div className={styles.topContainer}>
        <button>Cancel</button>
        <p>Add or remove from list</p>
        <button>Save</button>
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
      </div>
      <div>{/* inUserLibrary && remove from library button   */}</div>
    </div>
  );
};

export default AddToList;
