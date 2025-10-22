import { JWTPayload } from '../../utils/jwt.js';
import { RegisterInput, LoginInput } from '../../utils/validation.js';
export declare class AuthService {
    register(data: RegisterInput): Promise<{
        user: {
            email: string;
            id: string;
            createdAt: Date;
        };
        token: string;
    }>;
    login(data: LoginInput): Promise<{
        user: {
            id: string;
            email: string;
            createdAt: Date;
        };
        token: string;
    }>;
    verifyToken(token: string): Promise<JWTPayload>;
}
//# sourceMappingURL=auth.service.d.ts.map