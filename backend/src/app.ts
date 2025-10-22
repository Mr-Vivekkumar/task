import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { setupSwagger } from './config/swagger.js';
import './db/redis.js'; // Initialize Redis connection

// Import routes
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import categoriesRoutes from './modules/categories/categories.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import operationsRoutes from './modules/operations/operations.routes.js';
import bulkUploadRoutes from './modules/bulk-upload/bulk-upload.routes.js';
import reportsRoutes from './modules/reports/reports.routes.js';

const app = express();

// Middleware
const allowedOrigins = [
  'https://task-eight-weld.vercel.app', // Explicitly allow your frontend domain
  'http://localhost:4200', // Angular dev server
  'http://localhost:3000', // Alternative local dev
  'http://127.0.0.1:4200',
  'http://127.0.0.1:3000'
];

// Add environment-based origins if specified
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS allowing request with no origin');
      return callback(null, true);
    }
    
    // Check if origin is in allowed origins
    const isAllowed = allowedOrigins.includes(origin);
    
    if (isAllowed) {
      console.log('CORS allowing origin:', origin);
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     security: []
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Setup Swagger documentation
setupSwagger(app);

// Backward-compatible redirect for old docs path
app.get(['/api/docs', '/api/docs/{*splat}'], (req, res) => {
  res.redirect('/api-docs');
});

// API routes
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/categories', categoriesRoutes);
app.use('/products', productsRoutes);
app.use('/operations', operationsRoutes);
app.use('/products/bulk-upload', bulkUploadRoutes);
app.use('/reports', reportsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.all("/{*splat}", (req, res) => {
  res.status(404).json({ status: "fail", message: `Cannot ${req.method} ${req.originalUrl}` });
});

export default app;