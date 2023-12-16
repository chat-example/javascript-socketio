import { Router } from 'express';
import channdelGroupController from '../../controllers/channelGroup.controller.js';

const router = Router();

router.get('/:serverId', channdelGroupController.list.bind(channdelGroupController));
router.post('/:serverId', channdelGroupController.create.bind(channdelGroupController));
router.put('/:serverId', channdelGroupController.update.bind(channdelGroupController));
router.delete('/:serverId/:channelId', channdelGroupController.delete.bind(channdelGroupController)); 

export default router;