import { Router } from 'express';
import serverController from '../../controllers/server.controller.js';

const router = Router();

router.get('/', serverController.list.bind(serverController));
router.post('/join', serverController.join.bind(serverController));
router.post('/leave', serverController.leave.bind(serverController));
router.post('/', serverController.create.bind(serverController));
router.put('/', serverController.update.bind(serverController));
router.delete('/:serverId', serverController.delete.bind(serverController));

export default router;