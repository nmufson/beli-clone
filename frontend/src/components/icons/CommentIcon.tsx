const CommentIcon = ({ handleClick }: { handleClick: () => void }) => (
  <svg
    onClick={handleClick}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#212121"
  >
    <title>comment</title>
    <path d="M5,3H18C19.66,3 21,4.34 21,6V15C21,16.66 19.66,18 18,18H13.41L9.71,21.71C9.53,21.89 9.28,22 9,22C8.45,22 8,21.55 8,21V18H5C3.34,18 2,16.66 2,15V6C2,4.34 3.34,3 5,3M18,4H5C3.9,4 3,4.9 3,6V15C3,16.1 3.9,17 5,17H9V21L13,17H18C19.1,17 20,16.1 20,15V6C20,4.9 19.1,4 18,4Z" />
  </svg>
);

export default CommentIcon;
