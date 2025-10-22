import { Request, Response } from 'express';
export declare class BulkUploadController {
    private bulkUploadService;
    private operationsService;
    get upload(): import("multer").Multer;
    uploadProducts(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=bulk-upload.controller.d.ts.map