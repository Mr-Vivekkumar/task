import { Router } from 'express';
import { ReportsController } from './reports.controller.js';
import { authenticateToken } from '../../utils/middleware.js';
const router = Router();
const reportsController = new ReportsController();
router.use(authenticateToken);
router.get('/products.csv', (req, res) => reportsController.generateCSVReport(req, res));
router.get('/products.xlsx', (req, res) => reportsController.generateXLSXReport(req, res));
export default router;
//# sourceMappingURL=reports.routes.js.map