// this will go in the frontend
async function performBinarySearchComparisons(
  sortedBooks: { id: number; autoRating: number; title: string }[],
  newBook: { id: number; title: string },
) {
  let remainingBooks = [...sortedBooks];
  const pairwiseResults = [];

  for (let i = 0; i < 3; i++) {
    if (remainingBooks.length === 0) break;

    // Find the middle book
    const middleIndex = Math.floor(remainingBooks.length / 2);
    const middleBook = remainingBooks[middleIndex];

    const userPreference = await askUserPreference(newBook, middleBook);

    if (userPreference === 'newBook') {
      remainingBooks = remainingBooks.slice(middleIndex + 1);
      pairwiseResults.push({ winnerId: newBook.id, loserId: middleBook.id });
    } else {
      remainingBooks = remainingBooks.slice(0, middleIndex);
      pairwiseResults.push({ winnerId: middleBook.id, loserId: newBook.id });
    }
  }

  return pairwiseResults;
}

export default pairwiseComparisons;
