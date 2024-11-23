import * as bookServices from '../services/bookServices';

export async function reorderBooks(
  userId: number,
  pairwiseResults: { winnerId: number; loserId: number }[],
  reaction,
) {
  const booksByReaction = await bookServices.getAllBooksByReaction(
    userId,
    reaction,
  );

  pairwiseResults.forEach(({ winnerId, loserId }) => {
    const winnerIndex = booksByReaction.findIndex(
      (book) => book.id === winnerId,
    );
    const loserIndex = booksByReaction.findIndex((book) => book.id === loserId);

    if (winnerIndex < loserIndex) {
      const [winner] = booksByReaction.splice(winnerIndex, 1);
      booksByReaction.splice(loserIndex, 0, winner);
    }
  });

  const updatedBooks = booksByReaction.map((book, index) => ({
    id: book.id,
    order: index + 1,
  }));

  const updatedRecords = await bookServices.updateBookOrder(updatedBooks);

  return updatedRecords;

  // if this range has 7 books, assign ratings
  // regardless of how many are in the other ranges
}

export async function calculateRatings(userId: number, newBookId: number) {
  const ranges = {
    DISLIKED: [0, 3.33],
    OKAY: [3.34, 6.66],
    LIKED: [6.67, 10],
  };

  const processReaction = async (reaction: string) => {
    const books = await bookServices.getAllBooksByReaction(userId, reaction);
    // handles case where reaction category has no books yet
    if (books.length === 0) return;

    const range = ranges[reaction];

    const updatedBooks = books.map((book, index) => ({
      ...book,
      autoRating:
        // distribute the books within the range rather than pushing them to the boundaries
        // avoids making one book 6.67 and the other 10, or 0 / 3.33, etc
        range[0] + ((index + 1) / (books.length + 1)) * (range[1] - range[0]),
    }));

    await bookServices.updateBookRatings(updatedBooks);
    return updatedBooks;
  };

  const allUpdatedBooks = (
    await Promise.all(
      ['DISLIKED', 'OKAY', 'LIKED'].map((reaction) =>
        processReaction(reaction),
      ),
    )
  ).flat();

  const updatedNewBook = allUpdatedBooks.find((book) => book.id === newBookId);
  return updatedNewBook;
}
