import styles from './Footer.module.css';
import IconWrapper from '../IconWrapper/IconWrapper';
import NewspaperIcon from '../icons/NewspaperIcon';
import ListIcon from '../icons/ListIcon';
import PlusCircleIcon from '../icons/PlusCircleIcon';
import TrophyIcon from '../icons/TrophyIcon';
import { fetchFooterInfo } from '../../services/footerInfoService';
import { useEffect, useState } from 'react';
import ProfileIcon from '../icons/ProfileIcon';

const Footer = () => {
  const [userFooterInfo, setUserFooterInfo] = useState(null);

  useEffect(() => {
    const footerInfo = async () => {
      try {
        const userFooterInfo = await fetchFooterInfo();
        console.log(userFooterInfo);
        setUserFooterInfo(userFooterInfo);
      } catch (error) {
        console.log(error);
      }
    };
    footerInfo();
  }, []);

  return (
    <footer className={styles.footer}>
      <IconWrapper Icon={NewspaperIcon} text="Feed" />
      <IconWrapper Icon={ListIcon} text="Your Lists" />
      <IconWrapper Icon={PlusCircleIcon} text="Search" />
      <IconWrapper Icon={TrophyIcon} text="Leaderboard" />
      {/* replace this last one with user profile icon  */}
      {userFooterInfo ? (
        <div className={styles.profileWrapper}>
          {userFooterInfo.profileImageUrl ? (
            <img src={userFooterInfo.profileImageUrl} alt="" />
          ) : (
            <div className={styles.initialsWrapper}>
              {userFooterInfo.firstNameInitial.toUpperCase()}
              {userFooterInfo.lastNameInitial.toUpperCase()}
            </div>
          )}

          <p>Profile</p>
        </div>
      ) : (
        <IconWrapper Icon={ProfileIcon} text="Profile" />
      )}
    </footer>
  );
};

export default Footer;
