import Router from 'express';
import * as userController from '../controllers/userController';
import {
  checkAuthenticated,
  preventAuthenticatedAccess,
} from '../middleware/checkAuth';
import { check } from 'prettier';

const router = Router();

router.post('/check-email', userController.checkEmail);

router.post(
  '/signup',
  // validation,
  preventAuthenticatedAccess,
  userController.signUpUser,
);
router.get('/login', preventAuthenticatedAccess, userController.getLogInPage);
router.post(
  '/login',
  // validation,
  preventAuthenticatedAccess,
  userController.logInUser,
);
router.post('/logout', checkAuthenticated, userController.logOutUser);

router.get('/footer-info', checkAuthenticated, userController.getFooterInfo);

router.get('/user/:userIdParam', userController.getUserProfile);
router.post(
  '/user/:userIdParam',
  checkAuthenticated,
  userController.updateUserProfile,
);

router.post(
  '/follow-requests',
  checkAuthenticated,
  userController.sendFollowRequest,
);
router.put(
  '/follow-requests',
  checkAuthenticated,
  userController.affectFollowRequest,
);

router.delete(
  'follow-requests',
  checkAuthenticated,
  userController.cancelFollowRequest,
);

export default router;
