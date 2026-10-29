import { Router } from 'express';
import { itemsController } from '../controllers/items.controller';
import { validate } from '../middleware/validate';
import { createItemSchema, updateItemSchema, listQuerySchema } from '../schemas/item.schema';

const router = Router();

router.get('/', validate(listQuerySchema, 'query'), itemsController.list);
router.get('/:id', itemsController.getOne);
router.post('/', validate(createItemSchema), itemsController.create);
router.put('/:id', validate(updateItemSchema), itemsController.update);
router.delete('/:id', itemsController.remove);

export default router;

