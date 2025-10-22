import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const updateUserSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    image: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    price: z.ZodNumber;
    categoryId: z.ZodString;
}, z.core.$strip>;
export declare const updateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    image: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    price: z.ZodOptional<z.ZodNumber>;
    categoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const paginationSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    cursor: z.ZodOptional<z.ZodString>;
    sort: z.ZodOptional<z.ZodEnum<{
        price: "price";
        "-price": "-price";
    }>>;
    q: z.ZodOptional<z.ZodString>;
    categoryName: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
//# sourceMappingURL=validation.d.ts.map