import { Router } from 'express';
import { AuthController } from './auth.controller.js';
const router = Router();
const authController = new AuthController();
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
export default router;
//# sourceMappingURL=auth.routes.js.map