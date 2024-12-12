import styles from './Footer.module.css';
import IconWrapper from '../IconWrapper/IconWrapper';
import NewspaperIcon from '../icons/NewspaperIcon';
import ListIcon from '../icons/ListIcon';
import PlusCircleIcon from '../icons/PlusCircleIcon';
import TrophyIcon from '../icons/TrophyIcon';
import { fetchFooterInfo } from '../../services/footerInfoService';
import { useEffect, useState } from 'react';
import ProfileIcon from '../icons/ProfileIcon';
import Notification from '../Notifcation/Notification';
import { useNavigate } from 'react-router-dom';
import createSlug from '../../utils/createSlug';

const Footer = ({ isAuthenticated }) => {
  const [userFooterInfo, setUserFooterInfo] = useState(null);
  const [notificationInfo, setNotificationInfo] = useState({
    isOpen: false,
    content: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const footerInfo = async () => {
      if (isAuthenticated) {
        try {
          const userFooterInfo = await fetchFooterInfo();
          console.log(userFooterInfo);
          setUserFooterInfo(userFooterInfo);
        } catch (error) {
          console.log(error);
        }
      }
    };
    footerInfo();
  }, [isAuthenticated]);

  const handleFeedClick = () => {
    if (isAuthenticated) {
      navigate('/feed/user');
    } else {
      navigate('/feed/guest');
    }
  };

  const handleListsClick = () => {
    if (!isAuthenticated) {
      openNotification('lists');
      return;
    }
    navigate(`/lists/user/${userFooterInfo.userId}`);
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      openNotification('lists');
      return;
    }
    const fullName = userFooterInfo.firstName + ' ' + userFooterInfo.lastname;
    navigate(`/user/${userFooterInfo.userId}/${createSlug(fullName)}`);
  };

  const openNotification = (clickedIcon) => {
    setNotificationInfo({
      isOpen: true,
      content: `Must be logged in to view your ${clickedIcon}`,
    });
    setTimeout(() => setNotificationInfo({ isOpen: false, content: '' }), 2000);
  };

  return (
    <>
      <footer className={styles.footer}>
        <IconWrapper
          Icon={NewspaperIcon}
          text="Feed"
          handleClick={handleFeedClick}
        />
        <IconWrapper
          Icon={ListIcon}
          text="Your Lists"
          handleClick={handleListsClick}
        />
        <IconWrapper Icon={PlusCircleIcon} text="Search" />
        <IconWrapper Icon={TrophyIcon} text="Leaderboard" />
        {/* replace this last one with user profile icon  */}
        {userFooterInfo ? (
          <div className={styles.profileWrapper} onClick={handleProfileClick}>
            {userFooterInfo.profileImageUrl ? (
              <img src={userFooterInfo.profileImageUrl} alt="" />
            ) : (
              <div className={styles.initialsWrapper}>
                {userFooterInfo.firstName[0].toUpperCase()}
                {userFooterInfo.lastName[0].toUpperCase()}
              </div>
            )}

            <p>Profile</p>
          </div>
        ) : (
          <IconWrapper Icon={ProfileIcon} text="Profile" />
        )}
      </footer>
      {notificationInfo.isOpen && (
        <Notification content={notificationInfo.content} type="alert" />
      )}
    </>
  );
};

export default Footer;
