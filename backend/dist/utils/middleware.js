import { extractTokenFromHeader, verifyToken } from './jwt.js';
import { prisma } from '../db/connection.js';
export async function authenticateToken(req, res, next) {
    try {
        const token = extractTokenFromHeader(req.headers.authorization);
        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Access token required'
            });
            return;
        }
        const payload = verifyToken(token);
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, email: true }
        });
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }
}
export function validateRequest(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error
            });
        }
    };
}
//# sourceMappingURL=middleware.js.map