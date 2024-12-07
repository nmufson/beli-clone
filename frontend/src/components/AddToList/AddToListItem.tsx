import styles from './AddToList.module.css';

const AddToListItem = ({ value, label, selectedOption, handleChange }) => {
  return (
    <>
      <label className={styles.radioButton}>
        {label}
        <input
          type="radio"
          value={value}
          checked={selectedOption === value}
          onChange={handleChange}
        />
      </label>
    </>
  );
};

export default AddToListItem;
