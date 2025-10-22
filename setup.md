# Quick Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Redis (for job queue)
- Angular CLI

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials.

4. **Set up database:**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Start backend:**
   ```bash
   npm run dev
   ```

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start frontend:**
   ```bash
   npm start
   ```

## Access Points
- Frontend: http://localhost:4200
- Backend API: http://localhost:4000
- Health Check: http://localhost:4000/health

## Default Users
- admin@example.com / Admin#123
- manager@example.com / Manager#123
- user@example.com / User#123

## Testing
Import `postman/collection.json` into Postman to test all API endpoints.

## Features Implemented
✅ JWT Authentication with secure password hashing
✅ User CRUD operations
✅ Category CRUD operations  
✅ Product CRUD operations
✅ Server-side pagination with cursor-based pagination
✅ Product sorting (price ascending/descending)
✅ Search functionality (product and category names)
✅ Bulk upload with CSV/Excel support
✅ Streaming CSV and XLSX report generation
✅ Operation status tracking for long-running tasks
✅ Angular frontend with responsive design
✅ Comprehensive API documentation
✅ Postman collection for testing

## Next Steps
1. Set up Redis for job queue processing
2. Implement background workers for bulk upload
3. Add more comprehensive error handling
4. Add unit and integration tests
5. Set up CI/CD pipeline
6. Add monitoring and logging
