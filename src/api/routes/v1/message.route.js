import { Router } from 'express';
import messageController from '../../controllers/message.controller.js';

const router = Router();

router.get('/:channelId', messageController.list.bind(messageController));

export default router;
