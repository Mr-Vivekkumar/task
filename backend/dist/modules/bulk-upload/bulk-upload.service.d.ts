import multer from 'multer';
export declare class BulkUploadService {
    private operationsService;
    upload: multer.Multer;
    processBulkUpload(file: Express.Multer.File, operationId: string): Promise<void>;
    private parseCSV;
    private parseExcel;
    private processBatch;
}
//# sourceMappingURL=bulk-upload.service.d.ts.map