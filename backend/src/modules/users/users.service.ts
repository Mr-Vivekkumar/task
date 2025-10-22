import bcrypt from 'bcrypt';
import { prisma } from '../../db/connection.js';
import { CreateUserInput, UpdateUserInput } from '../../utils/validation.js';

export class UsersService {
  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async createUser(data: CreateUserInput) {
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
    return await prisma.user.create({
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
  }

  async updateUser(id: string, data: UpdateUserInput) {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updateData: any = {};

    if (data.email) {
      // Check if email is already taken by another user
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser && existingUser.id !== id) {
        throw new Error('Email already taken by another user');
      }

      updateData.email = data.email;
    }

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 12);
    }

    return await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });
  }

  async deleteUser(id: string) {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new Error('User not found');
    }

    await prisma.user.delete({
      where: { id }
    });

    return { message: 'User deleted successfully' };
  }
}
