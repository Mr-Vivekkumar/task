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
    './src/app.ts',
    './dist/modules/**/*.js', 
    './dist/app.js'
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

  // Setup Swagger UI with robust configuration
  console.log('Setting up Swagger UI...');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customCssUrl: 'https://unpkg.com/swagger-ui-dist/swagger-ui.css',
    customSiteTitle: 'Product Management API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      url: '/api-docs/swagger.json',
      dom_id: '#swagger-ui',
      deepLinking: true,
      tryItOutEnabled: true,
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
      validatorUrl: null, // Disable online validator
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      onComplete: () => {
        console.log('Swagger UI loaded successfully');
      },
      onFailure: (error: any) => {
        console.error('Swagger UI failed to load:', error);
      }
    }
  }));

  // Fallback route for when the default Swagger UI fails
  // app.get('/api-docs/fallback', (req, res) => {
  //   const html = `
  //   <!DOCTYPE html>
  //   <html lang="en">
  //   <head>
  //     <meta charset="UTF-8">
  //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //     <title>Product Management API Documentation</title>
  //     <style>
  //       body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  //       .header { background: #1f2937; color: white; padding: 1rem; text-align: center; }
  //       .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
  //       .api-list { display: grid; gap: 1rem; margin-top: 2rem; }
  //       .api-item { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; }
  //       .api-item h3 { margin: 0 0 0.5rem 0; color: #1f2937; }
  //       .api-item p { margin: 0; color: #6b7280; }
  //       .endpoint { font-family: monospace; background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 4px; }
  //       .method { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem; font-weight: bold; margin-right: 0.5rem; }
  //       .get { background: #dbeafe; color: #1e40af; }
  //       .post { background: #dcfce7; color: #166534; }
  //       .put { background: #fef3c7; color: #92400e; }
  //       .delete { background: #fee2e2; color: #991b1b; }
  //       .json-link { display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; text-decoration: none; border-radius: 4px; }
  //       .json-link:hover { background: #2563eb; }
  //     </style>
  //   </head>
  //   <body>
  //     <div class="header">
  //       <h1>Product Management API Documentation</h1>
  //       <p>API Documentation Fallback - Swagger UI is not available</p>
  //     </div>
  //     <div class="container">
  //       <p>This is a fallback documentation page. The Swagger UI is currently unavailable.</p>
  //       <a href="/api-docs/swagger.json" class="json-link" target="_blank">View Raw API Spec (JSON)</a>
        
  //       <div class="api-list">
  //         <div class="api-item">
  //           <h3>Authentication</h3>
  //           <p>User authentication and authorization endpoints</p>
  //           <div class="endpoint">
  //             <span class="method post">POST</span>/auth/register - Register new user
  //           </div>
  //           <div class="endpoint">
  //             <span class="method post">POST</span>/auth/login - User login
  //           </div>
  //         </div>
          
  //         <div class="api-item">
  //           <h3>Users</h3>
  //           <p>User management endpoints</p>
  //           <div class="endpoint">
  //             <span class="method get">GET</span>/users - List users
  //           </div>
  //           <div class="endpoint">
  //             <span class="method post">POST</span>/users - Create user
  //           </div>
  //           <div class="endpoint">
  //             <span class="method put">PUT</span>/users/:id - Update user
  //           </div>
  //           <div class="endpoint">
  //             <span class="method delete">DELETE</span>/users/:id - Delete user
  //           </div>
  //         </div>
          
  //         <div class="api-item">
  //           <h3>Categories</h3>
  //           <p>Product category management</p>
  //           <div class="endpoint">
  //             <span class="method get">GET</span>/categories - List categories
  //           </div>
  //           <div class="endpoint">
  //             <span class="method post">POST</span>/categories - Create category
  //           </div>
  //           <div class="endpoint">
  //             <span class="method put">PUT</span>/categories/:id - Update category
  //           </div>
  //           <div class="endpoint">
  //             <span class="method delete">DELETE</span>/categories/:id - Delete category
  //           </div>
  //         </div>
          
  //         <div class="api-item">
  //           <h3>Products</h3>
  //           <p>Product management endpoints</p>
  //           <div class="endpoint">
  //             <span class="method get">GET</span>/products - List products
  //           </div>
  //           <div class="endpoint">
  //             <span class="method post">POST</span>/products - Create product
  //           </div>
  //           <div class="endpoint">
  //             <span class="method put">PUT</span>/products/:id - Update product
  //           </div>
  //           <div class="endpoint">
  //             <span class="method delete">DELETE</span>/products/:id - Delete product
  //           </div>
  //         </div>
          
  //         <div class="api-item">
  //           <h3>Bulk Operations</h3>
  //           <p>Bulk upload and processing</p>
  //           <div class="endpoint">
  //             <span class="method post">POST</span>/products/bulk-upload - Upload products in bulk
  //           </div>
  //           <div class="endpoint">
  //             <span class="method get">GET</span>/operations - List operations
  //           </div>
  //           <div class="endpoint">
  //             <span class="method get">GET</span>/operations/:id - Get operation status
  //           </div>
  //         </div>
          
  //         <div class="api-item">
  //           <h3>Reports</h3>
  //           <p>Report generation endpoints</p>
  //           <div class="endpoint">
  //             <span class="method get">GET</span>/reports/products - Generate products report
  //           </div>
  //           <div class="endpoint">
  //             <span class="method get">GET</span>/reports/categories - Generate categories report
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </body>
  //   </html>
  //   `;
  //   res.send(html);
  // });
  
  console.log('Swagger setup completed');
};
