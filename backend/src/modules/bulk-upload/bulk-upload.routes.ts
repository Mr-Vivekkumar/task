import { Router } from 'express';
import { BulkUploadController } from './bulk-upload.controller.js';
import { authenticateToken } from '../../utils/middleware.js';

const router = Router();
const bulkUploadController = new BulkUploadController();

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /products/bulk-upload:
 *   post:
 *     summary: Upload CSV or Excel file for bulk product import
 *     tags: [Bulk Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV or Excel file containing product data
 *     responses:
 *       202:
 *         description: Bulk upload started successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BulkUploadResponse'
 *       400:
 *         description: No file uploaded or invalid file format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/', bulkUploadController.upload.single('file'), (req, res) => 
  bulkUploadController.uploadProducts(req, res)
);

export default router;
