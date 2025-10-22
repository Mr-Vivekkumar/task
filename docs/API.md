# API Documentation

## Base URL
```
http://localhost:4000
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:
```json
{
  "success": boolean,
  "data": any,
  "error"?: string
}
```

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token"
  }
}
```

### Users

#### Get All Users
```http
GET /users
Authorization: Bearer <token>
```

#### Create User
```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "Password123!"
}
```

#### Get User by ID
```http
GET /users/:id
Authorization: Bearer <token>
```

#### Update User
```http
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "updated@example.com",
  "password": "NewPassword123!"
}
```

#### Delete User
```http
DELETE /users/:id
Authorization: Bearer <token>
```

### Categories

#### Get All Categories
```http
GET /categories
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Electronics",
      "_count": {
        "products": 15
      }
    }
  ]
}
```

#### Create Category
```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Electronics"
}
```

#### Get Category by ID
```http
GET /categories/:id
Authorization: Bearer <token>
```

#### Update Category
```http
PUT /categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Electronics"
}
```

#### Delete Category
```http
DELETE /categories/:id
Authorization: Bearer <token>
```

### Products

#### Get Products (with pagination and filters)
```http
GET /products?limit=20&sort=price&q=phone&categoryName=Electronics
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (number, optional): Items per page (default: 20, max: 100)
- `cursor` (string, optional): Pagination cursor for next page
- `sort` (string, optional): Sort by price (`price` for ascending, `-price` for descending)
- `q` (string, optional): Search query for product and category names
- `categoryName` (string, optional): Filter by category name
- `categoryId` (string, optional): Filter by category ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "iPhone 15",
      "price": 999.99,
      "image": "https://example.com/iphone15.jpg",
      "category": {
        "id": "uuid",
        "name": "Electronics"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "hasNextPage": true,
    "nextCursor": "encoded-cursor-string",
    "limit": 20
  }
}
```

#### Create Product
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 15",
  "price": 999.99,
  "image": "https://example.com/iphone15.jpg",
  "categoryId": "category-uuid"
}
```

#### Get Product by ID
```http
GET /products/:id
Authorization: Bearer <token>
```

#### Update Product
```http
PUT /products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "price": 1099.99,
  "image": "https://example.com/iphone15pro.jpg"
}
```

#### Delete Product
```http
DELETE /products/:id
Authorization: Bearer <token>
```

### Bulk Upload

#### Upload CSV/Excel File
```http
POST /products/bulk-upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <csv-or-excel-file>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "operationId": "uuid",
    "status": "queued",
    "message": "Bulk upload started"
  }
}
```

**File Format:**
CSV/Excel files should have the following columns:
- `name` (required): Product name
- `price` (required): Product price
- `category` (required): Category name
- `image` (optional): Image URL

### Operations

#### Get Operation Status
```http
GET /operations/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "running",
    "type": "bulk_upload",
    "meta": {
      "filename": "products.csv",
      "totalRows": 1000,
      "processedRows": 500,
      "errors": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:05:00.000Z"
    }
  }
}
```

**Status Values:**
- `queued`: Operation is waiting to be processed
- `running`: Operation is currently being processed
- `succeeded`: Operation completed successfully
- `failed`: Operation failed with errors

### Reports

#### Download CSV Report
```http
GET /reports/products.csv
Authorization: Bearer <token>
```

**Response:** CSV file download

#### Download XLSX Report
```http
GET /reports/products.xlsx
Authorization: Bearer <token>
```

**Response:** Excel file download

## Pagination

The API uses cursor-based pagination for better performance with large datasets. To get the next page of results:

1. Make a request with the desired parameters
2. If `pagination.hasNextPage` is `true`, use `pagination.nextCursor` in the next request
3. Continue until `hasNextPage` is `false`

**Example:**
```http
# First page
GET /products?limit=20

# Next page
GET /products?limit=20&cursor=encoded-cursor-from-previous-response
```

## Search

The search functionality (`q` parameter) performs case-insensitive searches on:
- Product names
- Category names

**Example:**
```http
GET /products?q=phone
```

This will return products with "phone" in their name or category name.

## Sorting

Products can be sorted by price in ascending or descending order:

- `sort=price` - Sort by price ascending
- `sort=-price` - Sort by price descending

**Example:**
```http
GET /products?sort=-price
```

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message"
}
```

**Common Error Messages:**
- `"User with this email already exists"`
- `"Invalid email or password"`
- `"Access token required"`
- `"Invalid token"`
- `"User not found"`
- `"Category not found"`
- `"Product not found"`
- `"Validation error"`

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS

The API is configured to accept requests from `http://localhost:4200` (Angular dev server) by default. Update the `FRONTEND_URL` environment variable for production.
