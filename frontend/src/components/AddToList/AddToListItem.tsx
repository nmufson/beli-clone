import styles from './AddToList.module.css';

const AddToListItem = ({ value, label, selectedOption, handleChange }) => {
  return (
    <>
      <label className={styles.radioButton}>
        {label}
        <input
          type="radio"
          value={value}
          checked={selectedOption === 'option1'}
          onChange={handleChange}
        />
      </label>
    </>
  );
};

export default AddToListItem;
