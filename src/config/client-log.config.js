import { Router } from 'express';
import logger from '../utils/logger.js';
import clientLogger from '../utils/client-logger.js';

const router = Router();

router.use((req, res) => {
	try {
		clientLogger.process(req);
	} catch (e) {
		logger.error('Error while processing the client logs', e);
	}
	// always send 200 OK to the client
	res.json({ message: 'OK' });
});

export default router;
