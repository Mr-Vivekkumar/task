import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { setupSwagger } from './config/swagger.js';
import './db/redis.js';
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import categoriesRoutes from './modules/categories/categories.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import operationsRoutes from './modules/operations/operations.routes.js';
import bulkUploadRoutes from './modules/bulk-upload/bulk-upload.routes.js';
import reportsRoutes from './modules/reports/reports.routes.js';
const app = express();
const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : [
        /^http:\/\/localhost(?::\d+)?$/,
        /^http:\/\/127\.0\.0\.1(?::\d+)?$/,
        /^https:\/\/.*\.vercel\.app$/,
        /^https:\/\/.*\.vercel\.dev$/
    ];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
setupSwagger(app);
app.get(['/api/docs', '/api/docs/{*splat}'], (req, res) => {
    res.redirect('/api-docs');
});
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
app.all("/{*splat}", (req, res) => {
    res.status(404).json({ status: "fail", message: `Cannot ${req.method} ${req.originalUrl}` });
});
export default app;
//# sourceMappingURL=app.js.map