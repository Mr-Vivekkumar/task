import { Request, Response } from 'express';
import { UsersService } from './users.service.js';
import { createUserSchema, updateUserSchema } from '../../utils/validation.js';

export class UsersController {
  private usersService = new UsersService();

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.usersService.getAllUsers();
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users'
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
        return;
      }
      const user = await this.usersService.getUserById(id);
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch user'
        });
      }
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const user = await this.usersService.createUser(validatedData);
      res.status(201).json({
        success: true,
        data: user
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
          error: 'Failed to create user'
        });
      }
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
        return;
      }
      const validatedData = updateUserSchema.parse(req.body);
      const user = await this.usersService.updateUser(id, validatedData);
      res.json({
        success: true,
        data: user
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
          error: 'Failed to update user'
        });
      }
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
        return;
      }
      const result = await this.usersService.deleteUser(id);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to delete user'
        });
      }
    }
  }
}
