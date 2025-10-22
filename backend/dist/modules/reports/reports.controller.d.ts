import { Request, Response } from 'express';
export declare class ReportsController {
    private reportsService;
    generateCSVReport(req: Request, res: Response): Promise<void>;
    generateXLSXReport(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=reports.controller.d.ts.map