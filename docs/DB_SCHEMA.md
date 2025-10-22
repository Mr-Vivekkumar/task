# Database Schema

Below are SQL definitions for PostgreSQL and MySQL that match the Prisma models for `User`, `Category`, and `Product`, including UUID keys, constraints, and relevant indexes.

## PostgreSQL

```sql
-- Enable uuid-ossp for UUID generation if desired
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Optional: case-insensitive text for names
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name CITEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image TEXT NULL,
  price NUMERIC(19,4) NOT NULL CHECK (price >= 0),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes to support search and listing
CREATE INDEX IF NOT EXISTS idx_products_name ON products (name);
CREATE INDEX IF NOT EXISTS idx_products_price_id ON products (price, id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);

-- Case-insensitive search indexes (lower(name)), alternative to citext
CREATE INDEX IF NOT EXISTS idx_products_lower_name ON products ((lower(name)));
CREATE INDEX IF NOT EXISTS idx_categories_lower_name ON categories ((lower(name)));
```

## MySQL (8.0+)

```sql
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) UNIQUE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  image TEXT NULL,
  price DECIMAL(19,4) NOT NULL,
  category_id CHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id)
    REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Indexes to support search and listing
CREATE INDEX idx_products_name ON products (name);
CREATE INDEX idx_products_price_id ON products (price, id);
CREATE INDEX idx_products_category_id ON products (category_id);

-- Functional indexes for lower(name) where supported
CREATE INDEX idx_products_lower_name ON products ((LOWER(name)));
CREATE INDEX idx_categories_lower_name ON categories ((LOWER(name)));
```