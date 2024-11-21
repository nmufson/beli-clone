import styles from './Footer.module.css';
import IconWrapper from '../IconWrapper/IconWrapper';
import NewspaperIcon from '../icons/NewspaperIcon';
import ListIcon from '../icons/ListIcon';
import PlusCircleIcon from '../icons/PlusCircleIcon';
import TrophyIcon from '../icons/TrophyIcon';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <IconWrapper Icon={NewspaperIcon} text="Feed" />
      <IconWrapper Icon={ListIcon} text="Your Lists" />
      <IconWrapper Icon={PlusCircleIcon} text="Search" />
      <IconWrapper Icon={TrophyIcon} text="Leaderboard" />
      {/* replace this last one with user profile icon  */}
      <IconWrapper Icon={TrophyIcon} text="Profile" />
    </footer>
  );
};

export default Footer;
