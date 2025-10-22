export interface JWTPayload {
    userId: string;
    email: string;
}
export declare function generateToken(payload: JWTPayload): string;
export declare function verifyToken(token: string): JWTPayload;
export declare function extractTokenFromHeader(authHeader: string | undefined): string | null;
//# sourceMappingURL=jwt.d.ts.map