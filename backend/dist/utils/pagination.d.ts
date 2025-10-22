export interface CursorData {
    price: number;
    id: string;
}
export declare function encodeCursor(data: CursorData): string;
export declare function decodeCursor(cursor: string): CursorData | null;
export declare function buildOrderBy(sort?: string): any;
export declare function buildWhereClause(query: {
    q?: string | undefined;
    categoryName?: string | undefined;
    categoryId?: string | undefined;
}): any;
export declare function buildCursorCondition(cursor: CursorData | null, sort?: string): any;
//# sourceMappingURL=pagination.d.ts.map