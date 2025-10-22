import { prisma } from '../../db/connection.js';
import { CreateCategoryInput, UpdateCategoryInput } from '../../utils/validation.js';

export class CategoriesService {
  async getAllCategories() {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  }

  async getCategoryById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async createCategory(data: CreateCategoryInput) {
    const { name } = data;

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    });

    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    return await prisma.category.create({
      data: { name },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  }

  async updateCategory(id: string, data: UpdateCategoryInput) {
    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const { name } = data;

    // Check if name is already taken by another category
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    });

    if (existingCategory && existingCategory.id !== id) {
      throw new Error('Category name already taken by another category');
    }

    return await prisma.category.update({
      where: { id },
      data: { name },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  }

  async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    if (category._count.products > 0) {
      throw new Error('Cannot delete category with existing products');
    }

    await prisma.category.delete({
      where: { id }
    });

    return { message: 'Category deleted successfully' };
  }
}
