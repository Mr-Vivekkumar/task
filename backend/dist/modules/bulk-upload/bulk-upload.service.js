import multer from 'multer';
import { parse } from 'csv-parse';
import * as XLSX from 'exceljs';
import { Readable } from 'stream';
import { prisma } from '../../db/connection.js';
import { OperationsService } from '../operations/operations.service.js';
export class BulkUploadService {
    constructor() {
        this.operationsService = new OperationsService();
        this.upload = multer({
            storage: multer.memoryStorage(),
            limits: {
                fileSize: 50 * 1024 * 1024,
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
                }
                else {
                    cb(new Error('Only CSV and Excel files are allowed'));
                }
            }
        });
    }
    async processBulkUpload(file, operationId) {
        try {
            await this.operationsService.updateOperationStatus(operationId, 'running');
            const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
            let products = [];
            if (fileExtension === 'csv') {
                products = await this.parseCSV(file.buffer);
            }
            else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                products = await this.parseExcel(file.buffer);
            }
            else {
                throw new Error('Unsupported file format');
            }
            const batchSize = 1000;
            let processedRows = 0;
            const errors = [];
            for (let i = 0; i < products.length; i += batchSize) {
                const batch = products.slice(i, i + batchSize);
                try {
                    await this.processBatch(batch);
                    processedRows += batch.length;
                    await this.operationsService.updateOperationStatus(operationId, 'running', {
                        totalRows: products.length,
                        processedRows,
                        errors
                    });
                }
                catch (error) {
                    const errorMessage = `Batch ${Math.floor(i / batchSize) + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`;
                    errors.push(errorMessage);
                }
            }
            await this.operationsService.updateOperationStatus(operationId, 'succeeded', {
                totalRows: products.length,
                processedRows,
                errors,
                completedAt: new Date()
            });
        }
        catch (error) {
            await this.operationsService.updateOperationStatus(operationId, 'failed', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async parseCSV(buffer) {
        return new Promise((resolve, reject) => {
            const products = [];
            const parser = parse({
                columns: true,
                skip_empty_lines: true,
                trim: true
            });
            parser.on('data', (row) => {
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
            Readable.from(buffer).pipe(parser);
        });
    }
    async parseExcel(buffer) {
        const workbook = new XLSX.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            throw new Error('No worksheet found in Excel file');
        }
        const products = [];
        const headers = worksheet.getRow(1).values;
        const nameIndex = headers.findIndex(h => h?.toLowerCase().includes('name'));
        const priceIndex = headers.findIndex(h => h?.toLowerCase().includes('price'));
        const categoryIndex = headers.findIndex(h => h?.toLowerCase().includes('category'));
        const imageIndex = headers.findIndex(h => h?.toLowerCase().includes('image'));
        if (nameIndex === -1 || priceIndex === -1 || categoryIndex === -1) {
            throw new Error('Required columns (name, price, category) not found');
        }
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1)
                return;
            const values = row.values;
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
    async processBatch(products) {
        for (const productData of products) {
            try {
                let category = await prisma.category.findFirst({
                    where: { name: { equals: productData.category, mode: 'insensitive' } }
                });
                if (!category) {
                    category = await prisma.category.create({
                        data: { name: productData.category }
                    });
                }
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
            }
            catch (error) {
                console.error('Error processing product:', productData, error);
                throw error;
            }
        }
    }
}
//# sourceMappingURL=bulk-upload.service.js.map