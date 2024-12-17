import CloseIcon from '../icons/CloseIcon';
import styles from './RespondFollowRequestModal.module.css';

const RespondFollowRequestModal = ({
  setRespondFollowModalOpen,
  handleRespond,
}) => {
  const handleCloseModal = () => {
    setRespondFollowModalOpen(false);
  };

  const handleRespondClick = async (e) => {
    e.preventDefault();
    const { value } = e.target;

    if (value === 'accept') {
      handleRespond(true);
    } else if (value === 'reject') {
      handleRespond(false);
    }
    setRespondFollowModalOpen(false);
  };

  return (
    <>
      <div className={`modal ${styles.respondFollowRequest}`}>
        <div className={styles.wrapper} onClick={handleCloseModal}>
          <CloseIcon />
        </div>
        <h2>Respond to Follow Request</h2>
        <p>Accept follow request?</p>
        <div>
          <button onClick={handleRespondClick} value="reject">
            Reject
          </button>
          <button type="submit" value="accept" onClick={handleRespondClick}>
            Accept
          </button>
        </div>
      </div>
      <div className="backdrop" onClick={handleCloseModal}></div>
    </>
  );
};

export default RespondFollowRequestModal;
