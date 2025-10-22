# Product Management System

A full-stack application built with Angular (frontend), Node.js/Express (backend), and PostgreSQL (database) that provides comprehensive product management capabilities including CRUD operations, bulk upload, reporting, and advanced pagination.

## Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **User Management**: Complete CRUD operations for user accounts
- **Category Management**: Create, read, update, and delete product categories
- **Product Management**: Full product lifecycle management with image support
- **Advanced Product Listing**: Server-side pagination, sorting, and search
- **Bulk Upload**: Asynchronous CSV/Excel file processing for large datasets
- **Report Generation**: Streaming CSV and XLSX report downloads
- **Operation Tracking**: Real-time status monitoring for long-running tasks

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **Prisma** as ORM
- **PostgreSQL** as primary database
- **JWT** for authentication
- **bcrypt** for password hashing
- **BullMQ** for job queuing (planned)
- **Multer** for file uploads
- **ExcelJS** for Excel file processing
- **csv-parse** for CSV processing

### Frontend
- **Angular 20** with standalone components
- **Bootstrap 5** for styling
- **RxJS** for reactive programming
- **TypeScript** for type safety

## Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- Redis (for job queue)
- Angular CLI

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/product_management?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="1h"
REDIS_URL="redis://localhost:6379"
PORT=4000
NODE_ENV="development"
```

5. Generate Prisma client:
```bash
npm run db:generate
```

6. Run database migrations:
```bash
npm run db:migrate
```

7. Seed the database:
```bash
npm run db:seed
```

8. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:4200
- Backend API: http://localhost:4000
- API Documentation (Swagger): http://localhost:4000/api-docs

## API Documentation

### Interactive API Documentation (Swagger)

The API includes comprehensive Swagger documentation that can be accessed at:
**http://localhost:4000/api-docs**

The Swagger UI provides:
- Interactive API testing interface
- Complete endpoint documentation with examples
- Request/response schemas
- Authentication testing
- Try-it-out functionality for all endpoints

### Authentication Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### User Management

- `GET /users` - Get all users
- `POST /users` - Create a new user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Category Management

- `GET /categories` - Get all categories
- `POST /categories` - Create a new category
- `GET /categories/:id` - Get category by ID
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Product Management

- `GET /products` - Get products with pagination, sorting, and search
- `POST /products` - Create a new product
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

#### Product Query Parameters

- `limit` - Number of items per page (default: 20, max: 100)
- `cursor` - Pagination cursor for next page
- `sort` - Sort by price (`price` for ascending, `-price` for descending)
- `q` - Search query for product and category names
- `categoryName` - Filter by category name
- `categoryId` - Filter by category ID

### Bulk Upload

- `POST /products/bulk-upload` - Upload CSV/Excel file for bulk product import

### Operations

- `GET /operations/:id` - Get operation status

### Reports

- `GET /reports/products.csv` - Download products as CSV
- `GET /reports/products.xlsx` - Download products as XLSX

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `passwordHash` (String)
- `createdAt` (DateTime)

### Categories Table
- `id` (UUID, Primary Key)
- `name` (String, Unique)

### Products Table
- `id` (UUID, Primary Key)
- `name` (String)
- `image` (String, Optional)
- `price` (Decimal)
- `categoryId` (UUID, Foreign Key)
- `createdAt` (DateTime)

### Operations Table
- `id` (UUID, Primary Key)
- `type` (String) - 'bulk_upload' or 'report_generation'
- `status` (String) - 'queued', 'running', 'succeeded', 'failed'
- `meta` (JSON)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `completedAt` (DateTime, Optional)

## Testing

### Postman Collection

Import the `postman/collection.json` file into Postman to test all API endpoints. The collection includes:

- Authentication flows
- CRUD operations for all entities
- Pagination and search examples
- Bulk upload examples
- Report generation

### Sample Data

The database is seeded with:
- 3 sample users (admin@example.com, manager@example.com, user@example.com)
- 5 categories (Electronics, Books, Clothing, Home, Sports)
- 60 sample products

## Development

### Backend Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npm run db:migrate

# Reset database
npm run db:reset

# Generate Prisma client
npm run db:generate
```

### Frontend Development

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Production Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build the frontend and serve static files
5. Start the backend server
6. Configure reverse proxy (nginx) if needed

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with Zod
- SQL injection prevention with Prisma
- CORS configuration
- File upload restrictions

## Performance Features

- Server-side pagination with cursor-based pagination
- Database indexing for search and sorting
- Streaming file downloads
- Asynchronous bulk processing
- Connection pooling with Prisma

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
