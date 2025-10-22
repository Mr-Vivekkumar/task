import { Router } from 'express';
import { ProductsController } from './products.controller.js';
import { authenticateToken } from '../../utils/middleware.js';
const router = Router();
const productsController = new ProductsController();
router.use(authenticateToken);
router.get('/', (req, res) => productsController.getProducts(req, res));
router.post('/', (req, res) => productsController.createProduct(req, res));
router.get('/:id', (req, res) => productsController.getProductById(req, res));
router.put('/:id', (req, res) => productsController.updateProduct(req, res));
router.delete('/:id', (req, res) => productsController.deleteProduct(req, res));
export default router;
//# sourceMappingURL=products.routes.js.map