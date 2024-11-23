import Router from 'express';
import bookRoutes from './bookRoutes';
import userRoutes from './userRoutes';
import * as mainController from '../controllers/mainController';
import {
  checkAuthenticated,
  preventAuthenticatedAccess,
} from '../middleware/checkAuth';

const router = Router();

router.get('/', preventAuthenticatedAccess, mainController.getHomePage);
router.get('/feed', checkAuthenticated, mainController.getFeedPage);

router.use('/users', userRoutes);
router.use('/books', bookRoutes);

export default router;
