import Router from 'express';
import bookRoutes from './bookRoutes';
import userRoutes from './userRoutes';
import postRoutes from './postRoutes';
import * as postController from '../controllers/postController';
import * as mainController from '../controllers/mainController';
import {
  checkAuthenticated,
  preventAuthenticatedAccess,
} from '../middleware/checkAuth';

const router = Router();

router.get('/', preventAuthenticatedAccess, mainController.getHomePage);
router.get('/guest-feed', postController.getAllPosts);
router.get('/user-feed', checkAuthenticated, postController.getUserFeedPosts);
router.use('/users', userRoutes);
router.use('/books', bookRoutes);
router.use('/posts', postRoutes);

export default router;
