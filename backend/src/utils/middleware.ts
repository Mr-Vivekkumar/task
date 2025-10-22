import { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyToken } from './jwt.js';
import { prisma } from '../db/connection.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
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
    
    // Verify user still exists
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
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
}

export function validateRequest(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error
      });
    }
  };
}
