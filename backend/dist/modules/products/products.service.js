import { prisma } from '../../db/connection.js';
import { buildOrderBy, buildWhereClause, buildCursorCondition, encodeCursor, decodeCursor } from '../../utils/pagination.js';
export class ProductsService {
    async getProducts(query) {
        const { limit, cursor, sort, q, categoryName, categoryId } = query;
        const where = buildWhereClause({
            q: q,
            categoryName: categoryName,
            categoryId: categoryId
        });
        const orderBy = buildOrderBy(sort);
        const decodedCursor = cursor ? decodeCursor(cursor) : null;
        const cursorCondition = buildCursorCondition(decodedCursor, sort);
        const finalWhere = {
            ...where,
            ...cursorCondition
        };
        const products = await prisma.product.findMany({
            where: finalWhere,
            orderBy,
            take: limit + 1,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        const hasNextPage = products.length > limit;
        const items = hasNextPage ? products.slice(0, limit) : products;
        let nextCursor = null;
        if (hasNextPage && items.length > 0) {
            const lastItem = items[items.length - 1];
            if (lastItem) {
                nextCursor = encodeCursor({
                    price: Number(lastItem.price),
                    id: lastItem.id
                });
            }
        }
        return {
            items,
            pagination: {
                hasNextPage,
                nextCursor,
                limit
            }
        };
    }
    async getProductById(id) {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }
    async createProduct(data) {
        const { name, image, price, categoryId } = data;
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });
        if (!category) {
            throw new Error('Category not found');
        }
        return await prisma.product.create({
            data: {
                name,
                image: image || null,
                price,
                categoryId
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }
    async updateProduct(id, data) {
        const product = await prisma.product.findUnique({
            where: { id }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        const updateData = {};
        if (data.name !== undefined) {
            updateData.name = data.name;
        }
        if (data.image !== undefined) {
            updateData.image = data.image || null;
        }
        if (data.price !== undefined) {
            updateData.price = data.price;
        }
        if (data.categoryId !== undefined) {
            const category = await prisma.category.findUnique({
                where: { id: data.categoryId }
            });
            if (!category) {
                throw new Error('Category not found');
            }
            updateData.categoryId = data.categoryId;
        }
        return await prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }
    async deleteProduct(id) {
        const product = await prisma.product.findUnique({
            where: { id }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        await prisma.product.delete({
            where: { id }
        });
        return { message: 'Product deleted successfully' };
    }
}
//# sourceMappingURL=products.service.js.map