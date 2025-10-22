import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}
export declare function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function validateRequest(schema: any): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=middleware.d.ts.map