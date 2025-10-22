import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { setupSwagger } from './config/swagger.js';
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import categoriesRoutes from './modules/categories/categories.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import operationsRoutes from './modules/operations/operations.routes.js';
import bulkUploadRoutes from './modules/bulk-upload/bulk-upload.routes.js';
import reportsRoutes from './modules/reports/reports.routes.js';
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
setupSwagger(app);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/categories', categoriesRoutes);
app.use('/products', productsRoutes);
app.use('/operations', operationsRoutes);
app.use('/products/bulk-upload', bulkUploadRoutes);
app.use('/reports', reportsRoutes);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});
app.use('/*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});
export default app;
//# sourceMappingURL=app.js.map