import Router from 'express';
import * as bookController from '../controllers/bookController';
import { checkAuthenticated } from '../middleware/checkAuth';

const router = Router();

router.post('/shelve-book', checkAuthenticated, bookController.addBookToShelf);

router.post(
  'reorder-books',
  checkAuthenticated,
  bookController.processComparisonResults,
);
router.post('/finish-book', checkAuthenticated, bookController.addFinishedBook);

// router.get('/user-books', bookController.getAllUserBooks);

router.get('/user/:userIdParam', bookController.getAllUserBooksByUser);

router.get('/:userBookIdParam', bookController.getUserBook);

router.post('/:userBookIdParam', bookController.likeUserBook);
router.post(
  '/comment/:commentIdParam',

  bookController.likeComment,
);
router.delete('/:likeIdParam', bookController.deleteLike);

router.post('/:userBookIdParam/comment', bookController.commentOnPost);

router.get('/:userBookIdParam/likes', bookController.getUserBookLikes);
router.get('/:userBookIdParam/comments', bookController.getUserBookComments);
router.get('/comments/:commentIdParam/likes', bookController.getCommentLikes);

export default router;
