import { Router } from 'express';
import { ReportsController } from './reports.controller.js';
import { authenticateToken } from '../../utils/middleware.js';

const router = Router();
const reportsController = new ReportsController();

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /reports/products.csv:
 *   get:
 *     summary: Download products as CSV file
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             description: Attachment filename
 *             schema:
 *               type: string
 *               example: attachment; filename="products.csv"
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
router.get('/products.csv', (req, res) => reportsController.generateCSVReport(req, res));

/**
 * @swagger
 * /reports/products.xlsx:
 *   get:
 *     summary: Download products as Excel file
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel file download
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             description: Attachment filename
 *             schema:
 *               type: string
 *               example: attachment; filename="products.xlsx"
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
router.get('/products.xlsx', (req, res) => reportsController.generateXLSXReport(req, res));

export default router;
