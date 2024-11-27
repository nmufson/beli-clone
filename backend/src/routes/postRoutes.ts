import Router from 'express';
import * as postController from '../controllers/postController';
import { checkAuthenticated } from '../middleware/checkAuth';
import { check } from 'prettier';

const router = Router();

router.get('/post/:postId', postController.getPost);

router.post('/post/:postId', postController.likePost);
router.post(
  '/comment/:commentId',

  postController.likeComment,
);
router.post('/post/:postId/comment', postController.commentOnPost);

export default router;
