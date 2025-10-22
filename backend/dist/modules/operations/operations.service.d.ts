export interface OperationStatus {
    id: string;
    status: 'queued' | 'running' | 'succeeded' | 'failed';
    type: 'bulk_upload' | 'report_generation';
    meta: {
        totalRows?: number;
        processedRows?: number;
        errors?: string[];
        filename?: string;
        reportType?: 'csv' | 'xlsx';
        createdAt: Date;
        updatedAt: Date;
        completedAt?: Date;
    };
}
export declare class OperationsService {
    createOperation(type: 'bulk_upload' | 'report_generation', meta?: any): Promise<string>;
    getOperation(id: string): Promise<OperationStatus | null>;
    updateOperationStatus(id: string, status: 'queued' | 'running' | 'succeeded' | 'failed', meta?: any): Promise<void>;
    cleanupOldOperations(): Promise<void>;
}
//# sourceMappingURL=operations.service.d.ts.map