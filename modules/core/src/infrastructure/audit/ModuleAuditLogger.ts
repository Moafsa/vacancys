import { PrismaClient } from '@prisma/client';

export class ModuleAuditLogger {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async logModuleAction(
    moduleName: string,
    action: 'activate' | 'deactivate' | 'configure',
    userId: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.prisma.moduleAuditLog.create({
      data: {
        moduleName,
        action,
        userId,
        details: details || {},
        timestamp: new Date()
      }
    });
  }

  async getModuleAuditLogs(
    moduleName?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    return this.prisma.moduleAuditLog.findMany({
      where: {
        moduleName: moduleName ? { equals: moduleName } : undefined,
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }
} 