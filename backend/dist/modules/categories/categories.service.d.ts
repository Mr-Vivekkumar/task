import { CreateCategoryInput, UpdateCategoryInput } from '../../utils/validation.js';
export declare class CategoriesService {
    getAllCategories(): Promise<({
        _count: {
            products: number;
        };
    } & {
        name: string;
        id: string;
    })[]>;
    getCategoryById(id: string): Promise<{
        _count: {
            products: number;
        };
    } & {
        name: string;
        id: string;
    }>;
    createCategory(data: CreateCategoryInput): Promise<{
        _count: {
            products: number;
        };
    } & {
        name: string;
        id: string;
    }>;
    updateCategory(id: string, data: UpdateCategoryInput): Promise<{
        _count: {
            products: number;
        };
    } & {
        name: string;
        id: string;
    }>;
    deleteCategory(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=categories.service.d.ts.map