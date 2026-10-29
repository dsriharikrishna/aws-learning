import { Router } from 'express';
import healthRouter from './health';
import itemsRouter from './items';

const router = Router();

router.use('/', healthRouter);
router.use('/items', itemsRouter);

export default router;

