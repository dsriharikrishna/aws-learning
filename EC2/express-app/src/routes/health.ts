import { Router, Request, Response } from 'express';
import { itemsService } from '../services/items.service';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'express-app',
    version: '1.0.0',
  });
});

router.get('/ready', async (_req: Request, res: Response) => {
  try {
    await itemsService.ping();
    res.json({ status: 'ready', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'not ready', database: 'disconnected' });
  }
});

export default router;

