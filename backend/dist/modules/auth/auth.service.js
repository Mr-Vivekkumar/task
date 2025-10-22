import bcrypt from 'bcrypt';
import { prisma } from '../../db/connection.js';
import { generateToken } from '../../utils/jwt.js';
export class AuthService {
    async register(data) {
        const { email, password } = data;
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash
            },
            select: {
                id: true,
                email: true,
                createdAt: true
            }
        });
        const token = generateToken({
            userId: user.id,
            email: user.email
        });
        return {
            user,
            token
        };
    }
    async login(data) {
        const { email, password } = data;
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }
        const token = generateToken({
            userId: user.id,
            email: user.email
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt
            },
            token
        };
    }
    async verifyToken(token) {
        try {
            const { verifyToken } = await import('../../utils/jwt.js');
            return verifyToken(token);
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
}
//# sourceMappingURL=auth.service.js.map