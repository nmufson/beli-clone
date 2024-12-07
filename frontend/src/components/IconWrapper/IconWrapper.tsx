import styles from './IconWrapper.module.css';

const IconWrapper = ({ Icon, text, handleClick = () => {} }) => {
  return (
    <div className={styles.iconWrapper} onClick={handleClick}>
      <Icon />
      <p>{text}</p>
    </div>
  );
};

export default IconWrapper;
