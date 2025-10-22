import { CategoriesService } from './categories.service.js';
import { createCategorySchema, updateCategorySchema } from '../../utils/validation.js';
export class CategoriesController {
    constructor() {
        this.categoriesService = new CategoriesService();
    }
    async getAllCategories(req, res) {
        try {
            const categories = await this.categoriesService.getAllCategories();
            res.json({
                success: true,
                data: categories
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch categories'
            });
        }
    }
    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: 'Category ID is required'
                });
                return;
            }
            const category = await this.categoriesService.getCategoryById(id);
            res.json({
                success: true,
                data: category
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(404).json({
                    success: false,
                    error: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch category'
                });
            }
        }
    }
    async createCategory(req, res) {
        try {
            const validatedData = createCategorySchema.parse(req.body);
            const category = await this.categoriesService.createCategory(validatedData);
            res.status(201).json({
                success: true,
                data: category
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    error: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'Failed to create category'
                });
            }
        }
    }
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: 'Category ID is required'
                });
                return;
            }
            const validatedData = updateCategorySchema.parse(req.body);
            const category = await this.categoriesService.updateCategory(id, validatedData);
            res.json({
                success: true,
                data: category
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    error: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'Failed to update category'
                });
            }
        }
    }
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: 'Category ID is required'
                });
                return;
            }
            const result = await this.categoriesService.deleteCategory(id);
            res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    error: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'Failed to delete category'
                });
            }
        }
    }
}
//# sourceMappingURL=categories.controller.js.map