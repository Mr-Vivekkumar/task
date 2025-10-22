import bcrypt from 'bcrypt';
import { prisma } from '../../db/connection.js';
import { generateToken, JWTPayload } from '../../utils/jwt.js';
import { RegisterInput, LoginInput } from '../../utils/validation.js';

export class AuthService {
  async register(data: RegisterInput) {
    const { email, password } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
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

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    return {
      user,
      token
    };
  }

  async login(data: LoginInput) {
    const { email, password } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
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

  async verifyToken(token: string): Promise<JWTPayload> {
    try {
      const { verifyToken } = await import('../../utils/jwt.js');
      return verifyToken(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
