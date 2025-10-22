Below is a concise, implementation-ready task document you can drop into your repository for CursorAI to execute. It defines scope, folder structure, tech choices, acceptance criteria, commands, prompts, and step-by-step tasks so Cursor can scaffold, implement, and validate the full stack app.

Title
Angular + Node.js + RDBMS app with CRUD, bulk upload, reports, pagination/sort/

Objective
Build a production-grade system using Angular (frontend), Node.js/Express (backend), and PostgreSQL or MySQL (RDBMS) that

User CRUD and authentication (secure password storage), with permissions to manage categories/products.

Category CRUD.

Product CRUD with relation to Category.

Bulk product upload without timeouts (asynchronous processing).

Report generation (CSV and XLSX) without timeouts (streamed).

Product List API with server-side pagination, price sort asc/desc, and search by category/product names.

Scope and success criteria

Endpoints functionally complete and tested via an included Postman collection.

No long-running request causes gateway or proxy timeouts; heavy tasks run asynchronously and are tracked by a status endpoint.

Reports stream directly to client, handling large datasets efficiently.

Pagination is server-side and stable; sorting by price supported both ascending and descending; search by product/category names is case-insensitive.

Database enforces referential integrity: products must belong to a category.

Users stored with secure password hashing; no plaintext passwords.

High-level architecture

Frontend: Angular app consuming REST APIs; handles pagination/sort/search via query params; polls operation status for bulk tasks.

Backend: Node.js + Express with a queue-backed worker for bulk upload and report generation; uses streaming for CSV/XLSX responses; provides an operations status endpoint for long-running work.

DB: PostgreSQL (recommended) with UUID primary keys; MySQL supported with UUID stored as CHAR(36).

Repository structure

root/

frontend/ (Angular)

backend/

src/

modules/

auth/

users/

categories/

products/

reports/

operations/

bulk-upload/

db/

utils/

app.ts

server.ts

prisma/ or knex/ or sequelize/ (choose one ORM)

package.json

docs/

TASKS.md

API.md

DB_SCHEMA.md

OPERATIONS.md

postman/

collection.json

.env.example

Technical choices

Language: TypeScript for backend and Angular.

ORM: Choose Prisma or Knex (prefer Prisma for developer speed).

DB: PostgreSQL recommended; MySQL supported.

Auth: JWT-based session; password hashing with Argon2id or bcrypt.

Queue/Workers: Background job processing for bulk upload and report generation.

File handling: Multer or equivalent middleware with strict limits; stream parsing for CSV; exceljs streaming for XLSX.

HTTP semantics: Long-running jobs return 202 Accepted + Location to poll operation status.

Database schema

User

id (UUID/CHAR36)

email (unique)

password_hash

created_at

Category

id (UUID/CHAR36)

name (unique)

Product

id (UUID/CHAR36)

name

image (URL or path)

price (DECIMAL/NUMERIC, non-negative)

category_id (FK → Category.id)

created_at

API surface

Auth

POST /auth/register

POST /auth/login

Users

GET /users

POST /users

PUT /users/:id

DELETE /users/:id

Categories

GET /categories

POST /categories

PUT /categories/:id

DELETE /categories/:id

Products

GET /products

Query params:

page[limit]=number

cursor=opaque-string (keyset)

sort=price or sort=-price

q=string (search name)

categoryName=string or categoryId=uuid

POST /products

PUT /products/:id

DELETE /products/:id

Bulk upload

POST /products/bulk-upload (multipart/form-data; file field: file) → 202 + Location: /operations/:id

Operations

GET /operations/:id → { status: queued|running|succeeded|failed, meta }

Reports

GET /reports/products.csv (stream)

GET /reports/products.xlsx (stream)

Key backend requirements

Pagination: Implement keyset/cursor pagination on price with a stable tiebreaker id; ORDER BY price, id; use cursor with last (price,id) per direction.

Sorting: sort=price asc; sort=-price desc; adjust comparator and ORDER accordingly.

Search: Case-insensitive search on product.name and category.name with indexes on lower(name).

Bulk upload pipeline:

Accept CSV/XLSX via upload endpoint with size/file count limits.

Immediately enqueue a background job with request metadata and buffer/storage reference; respond 202 with Location to status.

Worker streams file parsing, validates rows, resolves/creates categories as needed, and upserts/inserts products in batches (e.g., 500–1000 rows).

Update operation status with counts, errors, and completion timestamp.

Reports:

CSV: stream using a stringifier piped to response; stream DB rows via cursor/iterator.

XLSX: use a streaming workbook writer and commit rows incrementally.

Security:

Hash passwords with Argon2id (preferred) or bcrypt; enforce strong parameters and validation; JWT with short TTL and refresh or re-login.

Input validation with a schema validator; sanitize filenames and reject unexpected mimetypes.

Errors:

Consistent error format; validation errors return 400; auth 401; forbidden 403; unknown 500; long-running tasks never hold the request open beyond enqueue.

Angular requirements

Use a ProductListService to call GET /products with server-driven pagination and sorting; maintain and pass cursor tokens; render next/prev navigation where applicable.

Build Category and Product CRUD forms; on success, invalidate cache and refresh lists.

Bulk upload UI: form with file input; on submit, call POST /products/bulk-upload, then poll Location until complete; show progress and result summary.

Reports: trigger CSV/XLSX downloads; no in-memory buffering.

Acceptance criteria checklist

Can create/update/delete users, categories, products with referential integrity enforced.

Product List supports:

Server-side pagination using cursor tokens.

Sorting by price asc/desc.

Search by product and category names.

Bulk upload of a large product file (e.g., 100k rows) completes without HTTP timeouts; API returns 202 with polling; final counts are correct.

CSV and XLSX report endpoints stream large datasets to the client without memory spikes or timeouts.

Postman collection covers auth, CRUD, listing with filters/sorting, bulk upload and operations status, and both report endpoints.

Environment and commands

Prereqs: Node 18+, Redis (for job queue), PostgreSQL/MySQL, Angular CLI.

Backend

cp .env.example .env and set DATABASE_URL, JWT_SECRET, REDIS_URL

Install: npm install

Migrate: npm run db:migrate

Dev: npm run dev

Worker: npm run worker

Lint/Test: npm run lint && npm test

Frontend

cd frontend && npm install

npm start

Postman

Import postman/collection.json

Set baseUrl and authToken variables after login.

CursorAI execution plan

Read this doc, then proceed task-by-task.

Create docs/DB_SCHEMA.md with the exact SQL for PostgreSQL and MySQL variants.

Scaffold backend with TypeScript, Express, and chosen ORM; configure DB connection and migrations.

Implement models/migrations for users, categories, products with UUIDs.

Implement auth (register/login) with secure hashing and JWT.

Implement CRUD routes and validation.

Implement GET /products with keyset pagination, sorting, and search; add required indexes.

Implement bulk upload endpoint (multipart) that enqueues a job and returns 202 with Location.

Implement operations status storage and endpoint.

Implement worker to stream-parse CSV, validate rows, batch insert, and update operation status.

Implement streamed CSV and XLSX report endpoints.

Add rate limits and file limits; add basic logging.

Build Angular UI pages for Users, Categories, Products; Product list with pagination/sort/search, Bulk Upload page, and “Download CSV/XLSX” actions.

Generate Postman collection at postman/collection.json with all endpoints and sample payloads.

Add README with setup, run, and testing instructions.

Cursor rules and prompts

Create .cursorrules with:

Use TypeScript strict mode.

Prefer pure functions and dependency injection.

For DB: Use prepared statements; never construct SQL with string concatenation for user input.

For bulk tasks: Always use streaming or batch sizes ≤ 1000; never buffer entire files/queries in memory.

For reports: Use streaming writers only.

Prompt pattern examples for Cursor:

“Open backend/src/modules/products and implement keyset pagination on price with a compound (price,id) cursor; expose asc/desc; add tests.”

“Implement POST /products/bulk-upload to enqueue a job and return 202 + Location; create operations store and GET /operations/:id.”

“Create reports controller to stream CSV/XLSX from DB cursor/iterator; do not buffer all rows.”

“Create Angular ProductListService with methods list({limit,cursor,sort,q,categoryName}); wire to ProductListComponent with infinite-scroll or ‘Next’ pagination.”

Testing checklist

Unit tests for pagination comparator logic and cursor encoding/decoding.

Integration tests for /products list with sort asc/desc and search filters.

Upload a 100k-row CSV; verify 202 → succeeded with correct counts and no server OOM.

Download CSV/XLSX with ≥ 100k rows; verify streamed download completes and memory stays stable.

Verify access tokens and protected routes; attempt invalid inputs and ensure correct error responses.

Deliverables

Working repository with frontend/ and backend/ as specified.

Postman collection under postman/collection.json.

Docs: README, DB_SCHEMA.md, API.md, OPERATIONS.md, TASKS.md (this file).

Notes for executor

Favor PostgreSQL for better UUID defaults and indexing options; support MySQL where feasible.

Keep configuration (.env) minimal and secure; do not commit secrets.

Ensure CORS is enabled for localhost dev ports of Angular and Node.

Provide seed scripts for a few users, categories, and products to demo pagination and search.