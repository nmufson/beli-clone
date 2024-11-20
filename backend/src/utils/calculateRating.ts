function calculateRating(
  pairwiseResults: { winnerId: number; loserId: number }[],
  userReaction: string,
  rangeBooks: { id: number; title: string; autoRating: number }[],
  newBookId: number,
): number {
  const initialRange = {
    disliked: [0, 3.33],
    okay: [3.34, 6.66],
    liked: [6.67, 10],
  };

  const range = initialRange[userReaction];

  const allBooks = [
    ...rangeBooks,
    { id: newBookId, title: 'newBook', autoRating: (range[1] - range[0]) / 2 },
  ];
  pairwiseResults.forEach(({ winnerId, loserId }) => {
    const winnerIndex = allBooks.findIndex((book) => book.id === winnerId);
    const loserIndex = allBooks.findIndex((book) => book.id === loserId);

    if (winnerIndex !== -1 && loserIndex !== -1 && winnerIndex < loserIndex) {
      const [winner] = allBooks.splice(winnerIndex, 1);
      allBooks.splice(loserIndex, 0, winner);
    }
  });

  const newRatings = allBooks.map((book, index) => ({
    ...book,
    autoRating:
      range[0] + (index / (allBooks.length - 1)) * (range[1] - range[0]),
  }));

  const newBook = newRatings.find((book) => book.id === newBookId);

  return newBook ? Math.min(10, Math.max(0, newBook.autoRating)) : 0;

  // we should return all the new ratings and update them in the db
}

export default calculateRating;
