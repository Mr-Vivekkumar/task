import swaggerJsdoc from 'swagger-jsdoc';
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
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
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique user identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp'
            }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique category identifier'
            },
            name: {
              type: 'string',
              description: 'Category name'
            },
            _count: {
              type: 'object',
              properties: {
                products: {
                  type: 'integer',
                  description: 'Number of products in this category'
                }
              }
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique product identifier'
            },
            name: {
              type: 'string',
              description: 'Product name'
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Product price'
            },
            image: {
              type: 'string',
              format: 'uri',
              nullable: true,
              description: 'Product image URL'
            },
            category: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid'
                },
                name: {
                  type: 'string'
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Product creation timestamp'
            }
          }
        },
        Operation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique operation identifier'
            },
            status: {
              type: 'string',
              enum: ['queued', 'running', 'succeeded', 'failed'],
              description: 'Operation status'
            },
            type: {
              type: 'string',
              enum: ['bulk_upload', 'report_generation'],
              description: 'Operation type'
            },
            meta: {
              type: 'object',
              properties: {
                totalRows: {
                  type: 'integer',
                  description: 'Total number of rows to process'
                },
                processedRows: {
                  type: 'integer',
                  description: 'Number of rows processed'
                },
                errors: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'List of errors encountered'
                },
                filename: {
                  type: 'string',
                  description: 'Name of the uploaded file'
                },
                reportType: {
                  type: 'string',
                  enum: ['csv', 'xlsx'],
                  description: 'Type of report being generated'
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time'
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time'
                },
                completedAt: {
                  type: 'string',
                  format: 'date-time',
                  nullable: true
                }
              }
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful'
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            error: {
              type: 'string',
              description: 'Error message if success is false'
            }
          }
        },
        PaginationResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Product'
              }
            },
            pagination: {
              type: 'object',
              properties: {
                hasNextPage: {
                  type: 'boolean',
                  description: 'Whether there are more pages available'
                },
                nextCursor: {
                  type: 'string',
                  nullable: true,
                  description: 'Cursor for the next page'
                },
                limit: {
                  type: 'integer',
                  description: 'Number of items per page'
                }
              }
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 8,
              pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]',
              description: 'Password with at least one uppercase, lowercase, number, and special character'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email'
            },
            password: {
              type: 'string',
              minLength: 1
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                token: {
                  type: 'string',
                  description: 'JWT access token'
                }
              }
            }
          }
        },
        CreateUserRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email'
            },
            password: {
              type: 'string',
              minLength: 8,
              pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'
            }
          }
        },
        UpdateUserRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email'
            },
            password: {
              type: 'string',
              minLength: 8,
              pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'
            }
          }
        },
        CreateCategoryRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              minLength: 1,
              maxLength: 255
            }
          }
        },
        UpdateCategoryRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              minLength: 1,
              maxLength: 255
            }
          }
        },
        CreateProductRequest: {
          type: 'object',
          required: ['name', 'price', 'categoryId'],
          properties: {
            name: {
              type: 'string',
              minLength: 1,
              maxLength: 255
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Product price (must be positive)'
            },
            image: {
              type: 'string',
              format: 'uri',
              nullable: true,
              description: 'Product image URL'
            },
            categoryId: {
              type: 'string',
              format: 'uuid',
              description: 'Category ID'
            }
          }
        },
        UpdateProductRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 1,
              maxLength: 255
            },
            price: {
              type: 'number',
              minimum: 0
            },
            image: {
              type: 'string',
              format: 'uri',
              nullable: true
            },
            categoryId: {
              type: 'string',
              format: 'uuid'
            }
          }
        },
        BulkUploadResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            data: {
              type: 'object',
              properties: {
                operationId: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Operation ID for tracking progress'
                },
                status: {
                  type: 'string',
                  enum: ['queued'],
                  description: 'Initial operation status'
                },
                message: {
                  type: 'string',
                  description: 'Status message'
                }
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
  },
  apis: [
    './src/modules/**/*.ts', 
    './src/app.ts'
  ]
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  console.log('Setting up Swagger with specs:', Object.keys(specs));
  
  // Handle OPTIONS request for swagger.json
  app.options('/api-docs/swagger.json', (req, res) => {
    console.log('OPTIONS request for swagger.json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
  });

  // Serve the swagger.json file first
  app.get('/api-docs/swagger.json', (req, res) => {
    try {
      console.log('Serving swagger.json');
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.send(specs);
    } catch (error) {
      console.error('Error serving swagger.json:', error);
      res.status(500).json({ error: 'Failed to generate API documentation' });
    }
  });

  // Debug: Log all requests to /api-docs
  app.use('/api-docs', (req, res, next) => {
    console.log('Swagger request:', req.method, req.url, req.headers['user-agent']);
    next();
  });

  // Setup Swagger UI with debugging
  console.log('Setting up Swagger UI...');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Product Management API Documentation',
    swaggerOptions: {
      url: '/api-docs/swagger.json',
      dom_id: '#swagger-ui',
      deepLinking: true,
      tryItOutEnabled: true,
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
      validatorUrl: null, // Disable online validator
      requestInterceptor: (req: any) => {
        console.log('Swagger request interceptor:', req.url, req.method);
        return req;
      },
      responseInterceptor: (res: any) => {
        console.log('Swagger response interceptor:', res.status);
        return res;
      }
    }
  }));

  // Handle problematic JavaScript files that are causing errors
  app.get('/api-docs/swagger-ui-bundle.js', (req, res) => {
    console.log('Request for swagger-ui-bundle.js - returning 404 to prevent HTML injection');
    res.status(404).json({ error: 'Asset not found' });
  });
  
  app.get('/api-docs/swagger-ui-standalone-preset.js', (req, res) => {
    console.log('Request for swagger-ui-standalone-preset.js - returning 404 to prevent HTML injection');
    res.status(404).json({ error: 'Asset not found' });
  });
  
  app.get('/api-docs/swagger-ui.css', (req, res) => {
    console.log('Request for swagger-ui.css - returning 404 to prevent HTML injection');
    res.status(404).json({ error: 'Asset not found' });
  });
  
  console.log('Swagger setup completed');
};
