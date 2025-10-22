export function encodeCursor(data) {
    return Buffer.from(JSON.stringify(data)).toString('base64');
}
export function decodeCursor(cursor) {
    try {
        return JSON.parse(Buffer.from(cursor, 'base64').toString());
    }
    catch {
        return null;
    }
}
export function buildOrderBy(sort) {
    if (sort === '-price') {
        return { price: 'desc', id: 'desc' };
    }
    return { price: 'asc', id: 'asc' };
}
export function buildWhereClause(query) {
    const where = {};
    if (query.q) {
        where.OR = [
            { name: { contains: query.q, mode: 'insensitive' } },
            { category: { name: { contains: query.q, mode: 'insensitive' } } }
        ];
    }
    if (query.categoryId) {
        where.categoryId = query.categoryId;
    }
    if (query.categoryName) {
        where.category = { name: { contains: query.categoryName, mode: 'insensitive' } };
    }
    return where;
}
export function buildCursorCondition(cursor, sort = 'price') {
    if (!cursor)
        return {};
    const isDesc = sort === '-price';
    if (isDesc) {
        return {
            OR: [
                { price: { lt: cursor.price } },
                {
                    AND: [
                        { price: cursor.price },
                        { id: { lt: cursor.id } }
                    ]
                }
            ]
        };
    }
    else {
        return {
            OR: [
                { price: { gt: cursor.price } },
                {
                    AND: [
                        { price: cursor.price },
                        { id: { gt: cursor.id } }
                    ]
                }
            ]
        };
    }
}
//# sourceMappingURL=pagination.js.map