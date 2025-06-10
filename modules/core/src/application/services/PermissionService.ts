import { Permission } from '@prisma/client';
import { prisma } from 'lib/prisma';

export class PermissionService {
  async create(name: string, description?: string): Promise<Permission> {
    return prisma.permission.create({ data: { name, description } });
  }

  async getAll(): Promise<Permission[]> {
    return prisma.permission.findMany();
  }

  async getById(id: string): Promise<Permission | null> {
    return prisma.permission.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<Permission>): Promise<Permission> {
    return prisma.permission.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Permission> {
    return prisma.permission.delete({ where: { id } });
  }
} 