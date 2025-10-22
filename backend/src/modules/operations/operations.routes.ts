import { Router } from 'express';
import { OperationsController } from './operations.controller.js';
import { authenticateToken } from '../../utils/middleware.js';

const router = Router();
const operationsController = new OperationsController();

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /operations/{id}:
 *   get:
 *     summary: Get operation status by ID
 *     tags: [Operations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Operation ID
 *     responses:
 *       200:
 *         description: Operation status details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Operation'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Operation not found
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
router.get('/:id', (req, res) => operationsController.getOperation(req, res));

export default router;
