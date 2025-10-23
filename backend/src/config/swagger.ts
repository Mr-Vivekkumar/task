import swaggerJsdoc from 'swagger-jsdoc';
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

// Step 1: Define the API Information using OpenAPI Specification
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Product Management API',
    version: '1.0.0',
    description: 'A comprehensive API for managing products, categories, users, and bulk operations',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC',
    },
  },
  servers: [
    {
      url: 'https://taskb-livid.vercel.app', // <-- CHANGE THIS if your production URL is different
      description: 'Production server (Vercel)',
    },
    {
      url: 'http://localhost:4000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    // Aapke saare schemas (User, Product, etc.) yahan define honge...
    // (Maine neeche poora schema section chhod diya hai, usko waise hi rehne dein)
    schemas: {
        User: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', description: 'Unique user identifier' },
              email: { type: 'string', format: 'email', description: 'User email address' },
              createdAt: { type: 'string', format: 'date-time', description: 'User creation timestamp' }
            }
        },
        Category: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', description: 'Unique category identifier' },
              name: { type: 'string', description: 'Category name' },
              _count: {
                type: 'object',
                properties: { products: { type: 'integer', description: 'Number of products in this category' } }
              }
            }
        },
        Product: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', description: 'Unique product identifier' },
              name: { type: 'string', description: 'Product name' },
              price: { type: 'number', format: 'decimal', description: 'Product price' },
              image: { type: 'string', format: 'uri', nullable: true, description: 'Product image URL' },
              category: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' }
                }
              },
              createdAt: { type: 'string', format: 'date-time', description: 'Product creation timestamp' }
            }
        },
        Operation: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', description: 'Unique operation identifier' },
              status: { type: 'string', enum: ['queued', 'running', 'succeeded', 'failed'], description: 'Operation status' },
              type: { type: 'string', enum: ['bulk_upload', 'report_generation'], description: 'Operation type' },
              meta: {
                type: 'object',
                properties: {
                  totalRows: { type: 'integer', description: 'Total number of rows to process' },
                  processedRows: { type: 'integer', description: 'Number of rows processed' },
                  errors: { type: 'array', items: { type: 'string' }, description: 'List of errors encountered' },
                  filename: { type: 'string', description: 'Name of the uploaded file' },
                  reportType: { type: 'string', enum: ['csv', 'xlsx'], description: 'Type of report being generated' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  completedAt: { type: 'string', format: 'date-time', nullable: true }
                }
              }
            }
        },
        // ... (Baki saare schemas yahan aayenge) ...
        // I am omitting the rest for brevity, but they should be here
    }
  },
  security: [{ bearerAuth: [] }],
};

// Step 2: Options for swagger-jsdoc to find API comments
const options = {
  swaggerDefinition,
  // Path to the API docs files
  apis: [
    './src/modules/**/*.ts', 
    './src/app.ts',
    './dist/modules/**/*.js', 
    './dist/app.js'
  ],
};

// Step 3: Initialize swagger-jsdoc
const specs = swaggerJsdoc(options);

// Step 4: Create a function to setup Swagger UI
export const setupSwagger = (app: Express) => {
  // Options for swagger-ui-express
  const swaggerUiOptions = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }', // Optional: Hides the top bar
    customSiteTitle: 'Product Management API Docs',
    customfavIcon: 'https://unpkg.com/swagger-ui-dist@5.11.0/favicon-32x32.png',

    // <<<--- YEH HAIN MAIN FIXES FOR VERCEL --- >>>
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css',
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js',
    ],
  };

  // Setup the Swagger UI middleware
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, swaggerUiOptions)
  );

  console.log('Swagger UI is available at /api-docs');
};