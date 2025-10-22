import { Router } from 'express';
import { BulkUploadController } from './bulk-upload.controller.js';
import { authenticateToken } from '../../utils/middleware.js';
const router = Router();
const bulkUploadController = new BulkUploadController();
router.use(authenticateToken);
router.post('/', bulkUploadController.upload.single('file'), (req, res) => bulkUploadController.uploadProducts(req, res));
export default router;
//# sourceMappingURL=bulk-upload.routes.js.map