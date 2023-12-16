import { Router } from 'express';
import serverController from '../../controllers/server.controller.js';

const router = Router();

router.get('/', () => {
  return 'hello world'
})
router.get('/list', serverController.list);

export default router;