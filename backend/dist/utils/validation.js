import { z } from 'zod';
export const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
});
export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
});
export const createUserSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
});
export const updateUserSchema = z.object({
    email: z.string().email('Invalid email format').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
        .optional()
});
export const createCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required').max(255, 'Category name too long')
});
export const updateCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required').max(255, 'Category name too long')
});
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
export const paginationSchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    cursor: z.string().optional(),
    sort: z.enum(['price', '-price']).optional(),
    q: z.string().optional(),
    categoryName: z.string().optional(),
    categoryId: z.string().uuid().optional()
});
//# sourceMappingURL=validation.js.map