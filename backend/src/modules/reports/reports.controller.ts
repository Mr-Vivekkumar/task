import { Request, Response } from 'express';
import { ReportsService } from './reports.service.js';

export class ReportsController {
  private reportsService = new ReportsService();

  async generateCSVReport(req: Request, res: Response) {
    await this.reportsService.generateCSVReport(res);
  }

  async generateXLSXReport(req: Request, res: Response) {
    await this.reportsService.generateXLSXReport(res);
  }
}
