import { ReportsService } from './reports.service.js';
export class ReportsController {
    constructor() {
        this.reportsService = new ReportsService();
    }
    async generateCSVReport(req, res) {
        await this.reportsService.generateCSVReport(res);
    }
    async generateXLSXReport(req, res) {
        await this.reportsService.generateXLSXReport(res);
    }
}
//# sourceMappingURL=reports.controller.js.map