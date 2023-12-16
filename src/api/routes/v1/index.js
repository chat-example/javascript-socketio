import { Router }  from 'express';
import serverRouter from './server.route.js';

const router = Router();

router.get('/status', (req, res) => {
  res.json({
    message: 'OK',
    timestamp: new Date().toISOString(),
    IP: req.ip,
    URL: req.originalUrl,
  });
});

router.use('/server', serverRouter);

export default router;
