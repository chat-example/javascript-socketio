import { Router } from 'express';
import channelController from '../../controllers/channel.controller.js';

const router = Router();

router.post('/:serverId', channelController.create.bind(channelController));
router.put('/:serverId', channelController.update.bind(channelController));
router.delete('/:serverId/:channelId', channelController.delete.bind(channelController));

export default router;