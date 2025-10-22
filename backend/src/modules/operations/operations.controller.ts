import { Request, Response } from 'express';
import { OperationsService } from './operations.service.js';

export class OperationsController {
  private operationsService = new OperationsService();

  async getOperation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Operation ID is required'
        });
        return;
      }
      const operation = await this.operationsService.getOperation(id);
      
      if (!operation) {
        res.status(404).json({
          success: false,
          error: 'Operation not found'
        });
        return;
      }

      res.json({
        success: true,
        data: operation
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch operation'
      });
    }
  }
}
