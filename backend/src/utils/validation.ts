import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// User schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .optional()
});

// Category schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(255, 'Category name too long')
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(255, 'Category name too long')
});

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255, 'Product name too long'),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  price: z.number().positive('Price must be positive'),
  categoryId: z.string().uuid('Invalid category ID')
});

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255, 'Product name too long').optional(),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  price: z.number().positive('Price must be positive').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional()
});

// Query schemas
export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
  sort: z.enum(['price', '-price']).optional(),
  q: z.string().optional(),
  categoryName: z.string().optional(),
  categoryId: z.string().uuid().optional()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
