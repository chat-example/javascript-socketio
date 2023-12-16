import { Router } from 'express';
import userController from '../../controllers/user.controller.js';

const router = Router();

router.post('/signinByEmail', userController.signInByEmail.bind(userController));
router.post('/signupByEmail', userController.signUpByEmail.bind(userController));
router.post('/signinByToken', userController.authByToken.bind(userController));

export default router;