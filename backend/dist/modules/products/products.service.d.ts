import { CreateProductInput, UpdateProductInput, PaginationQuery } from '../../utils/validation.js';
export declare class ProductsService {
    getProducts(query: PaginationQuery): Promise<{
        items: ({
            category: {
                name: string;
                id: string;
            };
        } & {
            name: string;
            price: import("@prisma/client/runtime/library.js").Decimal;
            categoryId: string;
            id: string;
            createdAt: Date;
            image: string | null;
        })[];
        pagination: {
            hasNextPage: boolean;
            nextCursor: string | null;
            limit: number;
        };
    }>;
    getProductById(id: string): Promise<{
        category: {
            name: string;
            id: string;
        };
    } & {
        name: string;
        price: import("@prisma/client/runtime/library.js").Decimal;
        categoryId: string;
        id: string;
        createdAt: Date;
        image: string | null;
    }>;
    createProduct(data: CreateProductInput): Promise<{
        category: {
            name: string;
            id: string;
        };
    } & {
        name: string;
        price: import("@prisma/client/runtime/library.js").Decimal;
        categoryId: string;
        id: string;
        createdAt: Date;
        image: string | null;
    }>;
    updateProduct(id: string, data: UpdateProductInput): Promise<{
        category: {
            name: string;
            id: string;
        };
    } & {
        name: string;
        price: import("@prisma/client/runtime/library.js").Decimal;
        categoryId: string;
        id: string;
        createdAt: Date;
        image: string | null;
    }>;
    deleteProduct(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=products.service.d.ts.map