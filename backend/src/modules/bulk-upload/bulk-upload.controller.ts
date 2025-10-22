import { Request, Response } from 'express';
import { BulkUploadService } from './bulk-upload.service.js';
import { OperationsService } from '../operations/operations.service.js';

export class BulkUploadController {
  private bulkUploadService = new BulkUploadService();
  private operationsService = new OperationsService();

  get upload() {
    return this.bulkUploadService.upload;
  }

  async uploadProducts(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
        return;
      }

      // Create operation record
      const operationId = await this.operationsService.createOperation('bulk_upload', {
        filename: req.file.originalname,
        totalRows: 0,
        processedRows: 0,
        errors: []
      });

      // Start processing in background (in a real app, this would be queued)
      this.bulkUploadService.processBulkUpload(req.file, operationId).catch(console.error);

      // Return 202 with location header
      res.status(202).json({
        success: true,
        data: {
          operationId,
          status: 'queued',
          message: 'Bulk upload started'
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to start bulk upload'
      });
    }
  }
}
