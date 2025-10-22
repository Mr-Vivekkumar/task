import multer from 'multer';
import { parse } from 'csv-parse';
import * as XLSX from 'exceljs';
import { Readable } from 'stream';
import { prisma } from '../../db/connection.js';
import { OperationsService } from '../operations/operations.service.js';

export class BulkUploadService {
  private operationsService = new OperationsService();

  // Configure multer for file uploads
  upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
      files: 1
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only CSV and Excel files are allowed'));
      }
    }
  });

  async processBulkUpload(file: Express.Multer.File, operationId: string): Promise<void> {
    try {
      await this.operationsService.updateOperationStatus(operationId, 'running');

      const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
      let products: any[] = [];

      if (fileExtension === 'csv') {
        products = await this.parseCSV(file.buffer);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        products = await this.parseExcel(file.buffer);
      } else {
        throw new Error('Unsupported file format');
      }

      // Process products in batches
      const batchSize = 1000;
      let processedRows = 0;
      const errors: string[] = [];

      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        
        try {
          await this.processBatch(batch);
          processedRows += batch.length;
          
          // Update progress
          await this.operationsService.updateOperationStatus(operationId, 'running', {
            totalRows: products.length,
            processedRows,
            errors
          });
        } catch (error) {
          const errorMessage = `Batch ${Math.floor(i / batchSize) + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMessage);
        }
      }

      // Mark as completed
      await this.operationsService.updateOperationStatus(operationId, 'succeeded', {
        totalRows: products.length,
        processedRows,
        errors,
        completedAt: new Date()
      });

    } catch (error) {
      await this.operationsService.updateOperationStatus(operationId, 'failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async parseCSV(buffer: Buffer): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const products: any[] = [];
      const parser = parse({
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      parser.on('data', (row) => {
        // Validate required fields
        if (row.name && row.price && row.category) {
          products.push({
            name: row.name.trim(),
            price: parseFloat(row.price),
            category: row.category.trim(),
            image: row.image?.trim() || null
          });
        }
      });

      parser.on('end', () => resolve(products));
      parser.on('error', reject);

      Readable.from(buffer as any).pipe(parser);
    });
  }

  private async parseExcel(buffer: Buffer): Promise<any[]> {
    const workbook = new XLSX.Workbook();
    await workbook.xlsx.load(buffer as any);
    
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error('No worksheet found in Excel file');
    }
    
    const products: any[] = [];
    
    const headers = worksheet.getRow(1).values as string[];
    const nameIndex = headers.findIndex(h => h?.toLowerCase().includes('name'));
    const priceIndex = headers.findIndex(h => h?.toLowerCase().includes('price'));
    const categoryIndex = headers.findIndex(h => h?.toLowerCase().includes('category'));
    const imageIndex = headers.findIndex(h => h?.toLowerCase().includes('image'));

    if (nameIndex === -1 || priceIndex === -1 || categoryIndex === -1) {
      throw new Error('Required columns (name, price, category) not found');
    }

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

      const values = row.values as any[];
      const name = values[nameIndex];
      const price = values[priceIndex];
      const category = values[categoryIndex];
      const image = values[imageIndex];

      if (name && price && category) {
        products.push({
          name: String(name).trim(),
          price: parseFloat(price),
          category: String(category).trim(),
          image: image ? String(image).trim() : null
        });
      }
    });

    return products;
  }

  private async processBatch(products: any[]): Promise<void> {
    for (const productData of products) {
      try {
        // Find or create category
        let category = await prisma.category.findFirst({
          where: { name: { equals: productData.category, mode: 'insensitive' } }
        });

        if (!category) {
          category = await prisma.category.create({
            data: { name: productData.category }
          });
        }

        // Create or update product
        await prisma.product.upsert({
          where: {
            id: productData.id || 'temp-id'
          },
          update: {
            price: productData.price,
            image: productData.image
          },
          create: {
            name: productData.name,
            price: productData.price,
            image: productData.image,
            categoryId: category.id
          }
        });
      } catch (error) {
        console.error('Error processing product:', productData, error);
        throw error;
      }
    }
  }
}
