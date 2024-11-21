import styles from './IconWrapper.module.css';

const IconWrapper = ({ Icon, text }) => {
  return (
    <div className={styles.iconWrapper}>
      <Icon />
      <p>{text}</p>
    </div>
  );
};

export default IconWrapper;
