import { Router } from 'express';
import userController from '../../controllers/user.controller.js';
import passport from 'passport';

const router = Router();

router.post('/signinByEmail', userController.signInByEmail.bind(userController));
router.post('/signupByEmail', userController.signUpByEmail.bind(userController));
router.put('/updateWithToken', userController.updateWithToken.bind(userController));

export default router;