import { BulkUploadService } from './bulk-upload.service.js';
import { OperationsService } from '../operations/operations.service.js';
export class BulkUploadController {
    constructor() {
        this.bulkUploadService = new BulkUploadService();
        this.operationsService = new OperationsService();
    }
    get upload() {
        return this.bulkUploadService.upload;
    }
    async uploadProducts(req, res) {
        try {
            if (!req.file) {
                res.status(400).json({
                    success: false,
                    error: 'No file uploaded'
                });
                return;
            }
            const operationId = await this.operationsService.createOperation('bulk_upload', {
                filename: req.file.originalname,
                totalRows: 0,
                processedRows: 0,
                errors: []
            });
            this.bulkUploadService.processBulkUpload(req.file, operationId).catch(console.error);
            res.status(202).json({
                success: true,
                data: {
                    operationId,
                    status: 'queued',
                    message: 'Bulk upload started'
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to start bulk upload'
            });
        }
    }
}
//# sourceMappingURL=bulk-upload.controller.js.map