import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { registerSchema, loginSchema } from '../../utils/validation.js';

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await this.authService.register(validatedData);
      
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await this.authService.login(validatedData);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }
}
