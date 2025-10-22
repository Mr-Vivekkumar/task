import { ProductsService } from './products.service.js';
import { createProductSchema, updateProductSchema, paginationSchema } from '../../utils/validation.js';
export class ProductsController {
    constructor() {
        this.productsService = new ProductsService();
    }
    async getProducts(req, res) {
        try {
            const validatedQuery = paginationSchema.parse(req.query);
            const result = await this.productsService.getProducts(validatedQuery);
            res.json({
                success: true,
                data: result.items,
                pagination: result.pagination
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
                    error: 'Failed to fetch products'
                });
            }
        }
    }
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: 'Product ID is required'
                });
                return;
            }
            const product = await this.productsService.getProductById(id);
            res.json({
                success: true,
                data: product
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
                    error: 'Failed to fetch product'
                });
            }
        }
    }
    async createProduct(req, res) {
        try {
            const validatedData = createProductSchema.parse(req.body);
            const product = await this.productsService.createProduct(validatedData);
            res.status(201).json({
                success: true,
                data: product
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
                    error: 'Failed to create product'
                });
            }
        }
    }
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: 'Product ID is required'
                });
                return;
            }
            const validatedData = updateProductSchema.parse(req.body);
            const product = await this.productsService.updateProduct(id, validatedData);
            res.json({
                success: true,
                data: product
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
                    error: 'Failed to update product'
                });
            }
        }
    }
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: 'Product ID is required'
                });
                return;
            }
            const result = await this.productsService.deleteProduct(id);
            res.json({
                success: true,
                data: result
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
                    error: 'Failed to delete product'
                });
            }
        }
    }
}
//# sourceMappingURL=products.controller.js.map