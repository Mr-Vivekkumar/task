import { Request, Response } from 'express';
export declare class UsersController {
    private usersService;
    getAllUsers(req: Request, res: Response): Promise<void>;
    getUserById(req: Request, res: Response): Promise<void>;
    createUser(req: Request, res: Response): Promise<void>;
    updateUser(req: Request, res: Response): Promise<void>;
    deleteUser(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=users.controller.d.ts.map