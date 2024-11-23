import Router from 'express';
import * as userController from '../controllers/userController';

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

router.post(
  '/logout',
  // auth to logout?
  userController.logOutUser,
);

export default router;
