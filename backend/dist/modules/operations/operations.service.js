import { prisma } from '../../db/connection.js';
export class OperationsService {
    async createOperation(type, meta = {}) {
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
    async getOperation(id) {
        const operation = await prisma.operation.findUnique({
            where: { id }
        });
        if (!operation) {
            return null;
        }
        return {
            id: operation.id,
            status: operation.status,
            type: operation.type,
            meta: operation.meta
        };
    }
    async updateOperationStatus(id, status, meta) {
        const updateData = {
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
    async cleanupOldOperations() {
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
//# sourceMappingURL=operations.service.js.map