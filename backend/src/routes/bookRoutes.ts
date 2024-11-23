import Router from 'express';
import * as bookController from '../controllers/bookController';

const router = Router();

router.post('/finishedBook', bookController.addFinishedBook);
router.post('/shelvedBook', bookController.addBookToShelf);

export default router;
