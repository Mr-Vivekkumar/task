import { Response } from 'express';
import { prisma } from '../../db/connection.js';
import { OperationsService } from '../operations/operations.service.js';
import * as XLSX from 'exceljs';

export class ReportsService {
  private operationsService = new OperationsService();

  async generateCSVReport(res: Response): Promise<void> {
    try {
      // Create operation record
      const operationId = await this.operationsService.createOperation('report_generation', {
        reportType: 'csv',
        totalRows: 0,
        processedRows: 0
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');

      // Write CSV header
      res.write('ID,Name,Price,Category,Image,Created At\n');

      let processedRows = 0;
      const batchSize = 1000;
      let cursor: string | undefined;

      while (true) {
        const products = await prisma.product.findMany({
          take: batchSize,
          skip: cursor ? 1 : 0,
          ...(cursor && { cursor: { id: cursor } }),
          orderBy: { id: 'asc' },
          include: {
            category: {
              select: { name: true }
            }
          }
        });

        if (products.length === 0) break;

        // Write products to response
        for (const product of products) {
          const row = [
            product.id,
            `"${product.name.replace(/"/g, '""')}"`,
            product.price.toString(),
            `"${product.category.name.replace(/"/g, '""')}"`,
            product.image ? `"${product.image.replace(/"/g, '""')}"` : '',
            product.createdAt.toISOString()
          ].join(',') + '\n';

          res.write(row);
          processedRows++;
        }

        // Update progress
        await this.operationsService.updateOperationStatus(operationId, 'running', {
          totalRows: processedRows,
          processedRows
        });

        if (products.length < batchSize) break;
        const lastProduct = products[products.length - 1];
        if (lastProduct) {
          cursor = lastProduct.id;
        }
      }

      // Mark as completed
      await this.operationsService.updateOperationStatus(operationId, 'succeeded', {
        totalRows: processedRows,
        processedRows,
        completedAt: new Date()
      });

      res.end();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate CSV report'
      });
    }
  }

  async generateXLSXReport(res: Response): Promise<void> {
    try {
      // Create operation record
      const operationId = await this.operationsService.createOperation('report_generation', {
        reportType: 'xlsx',
        totalRows: 0,
        processedRows: 0
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="products.xlsx"');

      const workbook = new XLSX.Workbook();
      const worksheet = workbook.addWorksheet('Products');

      // Add headers
      worksheet.addRow(['ID', 'Name', 'Price', 'Category', 'Image', 'Created At']);

      let processedRows = 0;
      const batchSize = 1000;
      let cursor: string | undefined;

      while (true) {
        const products = await prisma.product.findMany({
          take: batchSize,
          skip: cursor ? 1 : 0,
          ...(cursor && { cursor: { id: cursor } }),
          orderBy: { id: 'asc' },
          include: {
            category: {
              select: { name: true }
            }
          }
        });

        if (products.length === 0) break;

        // Add products to worksheet
        for (const product of products) {
          worksheet.addRow([
            product.id,
            product.name,
            Number(product.price),
            product.category?.name || 'Unknown',
            product.image || '',
            product.createdAt
          ]);
          processedRows++;
        }

        // Update progress
        await this.operationsService.updateOperationStatus(operationId, 'running', {
          totalRows: processedRows,
          processedRows
        });

        if (products.length < batchSize) break;
        const lastProduct = products[products.length - 1];
        if (lastProduct) {
          cursor = lastProduct.id;
        }
      }

      // Mark as completed
      await this.operationsService.updateOperationStatus(operationId, 'succeeded', {
        totalRows: processedRows,
        processedRows,
        completedAt: new Date()
      });

      // Stream the workbook to response
      await workbook.xlsx.write(res);
      // Make sure to end the response properly
      res.status(200).end();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate XLSX report'
      });
    }
  }
}
