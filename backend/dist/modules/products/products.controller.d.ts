import { Request, Response } from 'express';
export declare class ProductsController {
    private productsService;
    getProducts(req: Request, res: Response): Promise<void>;
    getProductById(req: Request, res: Response): Promise<void>;
    createProduct(req: Request, res: Response): Promise<void>;
    updateProduct(req: Request, res: Response): Promise<void>;
    deleteProduct(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=products.controller.d.ts.map