import { prisma } from '../../db/connection.js';

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

export class OperationsService {
  async createOperation(type: 'bulk_upload' | 'report_generation', meta: any = {}): Promise<string> {
    const operation = await prisma.operation.create({
      data: {
        type,
        status: 'queued',
        meta: {
          ...meta,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    });

    return operation.id;
  }

  async getOperation(id: string): Promise<OperationStatus | null> {
    const operation = await prisma.operation.findUnique({
      where: { id }
    });

    if (!operation) {
      return null;
    }

    return {
      id: operation.id,
      status: operation.status as any,
      type: operation.type as any,
      meta: operation.meta as any
    };
  }

  async updateOperationStatus(
    id: string, 
    status: 'queued' | 'running' | 'succeeded' | 'failed',
    meta?: any
  ): Promise<void> {
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (meta) {
      updateData.meta = {
        ...meta,
        updatedAt: new Date()
      };
    }

    if (status === 'succeeded' || status === 'failed') {
      updateData.completedAt = new Date();
    }

    await prisma.operation.update({
      where: { id },
      data: updateData
    });
  }

  async cleanupOldOperations(): Promise<void> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    await prisma.operation.deleteMany({
      where: {
        completedAt: {
          lt: oneWeekAgo
        }
      }
    });
  }
}
