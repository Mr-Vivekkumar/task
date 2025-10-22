import { Router } from 'express';
import { CategoriesController } from './categories.controller.js';
import { authenticateToken } from '../../utils/middleware.js';
const router = Router();
const categoriesController = new CategoriesController();
router.use(authenticateToken);
router.get('/', (req, res) => categoriesController.getAllCategories(req, res));
router.post('/', (req, res) => categoriesController.createCategory(req, res));
router.get('/:id', (req, res) => categoriesController.getCategoryById(req, res));
router.put('/:id', (req, res) => categoriesController.updateCategory(req, res));
router.delete('/:id', (req, res) => categoriesController.deleteCategory(req, res));
export default router;
//# sourceMappingURL=categories.routes.js.map