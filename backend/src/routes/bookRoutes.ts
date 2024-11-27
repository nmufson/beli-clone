import Router from 'express';
import * as bookController from '../controllers/bookController';
import { checkAuthenticated } from '../middleware/checkAuth';

const router = Router();

router.get('/user-books', bookController.getAllUserBooks);

router.post('/shelved-book', checkAuthenticated, bookController.addBookToShelf);

router.post(
  'reorder-books',
  checkAuthenticated,
  bookController.processComparisonResults,
);
router.post(
  '/finished-book',
  checkAuthenticated,
  bookController.addFinishedBook,
);

export default router;
