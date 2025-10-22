import { Request, Response } from 'express';
export declare class CategoriesController {
    private categoriesService;
    getAllCategories(req: Request, res: Response): Promise<void>;
    getCategoryById(req: Request, res: Response): Promise<void>;
    createCategory(req: Request, res: Response): Promise<void>;
    updateCategory(req: Request, res: Response): Promise<void>;
    deleteCategory(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=categories.controller.d.ts.map