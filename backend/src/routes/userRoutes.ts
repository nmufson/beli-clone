import Router from 'express';
import * as userController from '../controllers/userController';
import { checkAuthenticated } from '../middleware/checkAuth';

const router = Router();

router.post(
  '/signup',
  // validation,
  userController.signUpUser,
);

router.post(
  '/login',
  // validation,
  userController.logInUser,
);

router.get('/auth/status', checkAuthenticated, userController.checkAuthStatus);

router.post('/check-email', userController.checkEmail);

router.post(
  '/logout',
  // auth to logout?
  userController.logOutUser,
);

export default router;
