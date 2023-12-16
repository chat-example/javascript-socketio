import { Router } from 'express';
import userController from '../../controllers/user.controller.js';

const router = Router();

router.post('/signupByEmail', userController.signUpByEmail.bind(userController));
router.post('/signInByEmail', userController.signInByEmail.bind(userController));
router.post('/signOut', userController.signOut.bind(userController));
router.put('/', userController.updateWithToken.bind(userController));
router.delete('/', userController.deleteWithToken.bind(userController));

export default router;