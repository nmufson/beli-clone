const formatDate = (dateString: string) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const date = new Date(dateString);
  return date.toLocaleString('en-US', options);
};

export default formatDate;
