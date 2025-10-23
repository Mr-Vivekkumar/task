import swaggerJsdoc from 'swagger-jsdoc';
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

// Step 1: Define the API Information
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Product Management API',
    version: '1.0.0',
    description: 'A comprehensive API for managing products, categories, users, and bulk operations',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    }
  },
  servers: [
    {
      url: 'https://taskb-livid.vercel.app',
      description: 'Production server (Vercel)'
    },
    {
      url: 'http://localhost:4000',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
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
            properties: {
              products: { type: 'integer', description: 'Number of products in this category' }
            }
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
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', description: 'Indicates if the request was successful' },
          data: { type: 'object', description: 'Response data' },
          error: { type: 'string', description: 'Error message if success is false' }
        }
      },
      PaginationResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
          pagination: {
            type: 'object',
            properties: {
              hasNextPage: { type: 'boolean', description: 'Whether there are more pages available' },
              nextCursor: { type: 'string', nullable: true, description: 'Cursor for the next page' },
              limit: { type: 'integer', description: 'Number of items per page' }
            }
          }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', description: 'User email address' },
          password: { type: 'string', minLength: 8, pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]', description: 'Password with at least one uppercase, lowercase, number, and special character' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 1 }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/User' },
              token: { type: 'string', description: 'JWT access token' }
            }
          }
        }
      },
      CreateUserRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8, pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]' }
        }
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8, pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]' }
        }
      },
      CreateCategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 }
        }
      },
      UpdateCategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 }
        }
      },
      CreateProductRequest: {
        type: 'object',
        required: ['name', 'price', 'categoryId'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 },
          price: { type: 'number', minimum: 0, description: 'Product price (must be positive)' },
          image: { type: 'string', format: 'uri', nullable: true, description: 'Product image URL' },
          categoryId: { type: 'string', format: 'uuid', description: 'Category ID' }
        }
      },
      UpdateProductRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 },
          price: { type: 'number', minimum: 0 },
          image: { type: 'string', format: 'uri', nullable: true },
          categoryId: { type: 'string', format: 'uuid' }
        }
      },
      BulkUploadResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              operationId: { type: 'string', format: 'uuid', description: 'Operation ID for tracking progress' },
              status: { type: 'string', enum: ['queued'], description: 'Initial operation status' },
              message: { type: 'string', description: 'Status message' }
            }
          }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

// Step 2: Options for swagger-jsdoc
const options = {
  definition: swaggerDefinition,
  // APIs array ko aasan bana diya. Vercel par sirf .js files hi chalti hain.
  apis: [
    path.join(process.cwd(), 'dist/modules/**/*.js'),
    path.join(process.cwd(), 'dist/app.js'),
  ],
};

// Step 3: Initialize swagger-jsdoc
const specs = swaggerJsdoc(options);

// Step 4: Create a function to setup Swagger UI
export const setupSwagger = (app: Express) => {

  // Swagger UI ke liye saaf-suthre options
  const swaggerUiOptions = {
    explorer: true,
    customSiteTitle: 'Product Management API Documentation',
    customfavIcon: 'https://unpkg.com/swagger-ui-dist@5.11.0/favicon-32x32.png',
    
    // <<< --- YEH HAI ASLI FIX --- >>>
    // Poore CDN links (CSS + JS) for reliable performance on Vercel
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css',
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js',
    ],
  };

  // Sirf ek line mein Swagger UI ko setup karein. Koi extra route ki zaroorat nahi.
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, swaggerUiOptions)
  );

  console.log('Swagger UI is configured and available at /api-docs');
};