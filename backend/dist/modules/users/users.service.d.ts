import { CreateUserInput, UpdateUserInput } from '../../utils/validation.js';
export declare class UsersService {
    getAllUsers(): Promise<{
        email: string;
        id: string;
        createdAt: Date;
    }[]>;
    getUserById(id: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
    }>;
    createUser(data: CreateUserInput): Promise<{
        email: string;
        id: string;
        createdAt: Date;
    }>;
    updateUser(id: string, data: UpdateUserInput): Promise<{
        email: string;
        id: string;
        createdAt: Date;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=users.service.d.ts.map