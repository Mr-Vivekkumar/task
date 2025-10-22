import { Router } from 'express';
import { OperationsController } from './operations.controller.js';
import { authenticateToken } from '../../utils/middleware.js';
const router = Router();
const operationsController = new OperationsController();
router.use(authenticateToken);
router.get('/:id', (req, res) => operationsController.getOperation(req, res));
export default router;
//# sourceMappingURL=operations.routes.js.map