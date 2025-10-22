import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { authenticateToken } from '../../utils/middleware.js';
const router = Router();
const usersController = new UsersController();
router.use(authenticateToken);
router.get('/', (req, res) => usersController.getAllUsers(req, res));
router.post('/', (req, res) => usersController.createUser(req, res));
router.get('/:id', (req, res) => usersController.getUserById(req, res));
router.put('/:id', (req, res) => usersController.updateUser(req, res));
router.delete('/:id', (req, res) => usersController.deleteUser(req, res));
export default router;
//# sourceMappingURL=users.routes.js.map