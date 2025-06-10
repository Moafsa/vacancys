import { PrismaClient, User as PrismaUser, Role, Status, Prisma } from '@prisma/client';

export interface IUserRepository {
  create(user: Prisma.UserCreateInput): Promise<PrismaUser>;
  findById(id: string): Promise<PrismaUser | null>;
  findByEmail(email: string): Promise<PrismaUser | null>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<PrismaUser>;
  delete(id: string): Promise<void>;
  list({ page, limit }: { page: number; limit: number }): Promise<{ users: PrismaUser[]; total: number }>;
  findMany(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: Role;
    status?: Status;
    verified?: boolean;
  }): Promise<{ users: PrismaUser[]; total: number }>;
}

export class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: Prisma.UserCreateInput): Promise<PrismaUser> {
    console.log('[USER-REPO] Criando usuário:', data);
    // Cria o usuário
    const user = await this.prisma.user.create({
      data,
    });
    console.log('[USER-REPO] Usuário criado:', user.id, user.email);
    // Cria o registro de verificação de conta se não existir
    const existingVerification = await this.prisma.accountVerification.findUnique({ where: { userId: user.id } });
    if (!existingVerification) {
      try {
        const verification = await this.prisma.accountVerification.create({
          data: {
            userId: user.id,
            status: 'PENDING',
            documentStatus: 'PENDING',
            proofOfAddressStatus: 'PENDING',
            selfieStatus: 'PENDING',
          },
        });
        console.log('[USER-REPO] AccountVerification criado:', verification);
      } catch (err) {
        console.error('[USER-REPO] Failed to create accountVerification for user', user.id, err);
      }
    } else {
      console.log('[USER-REPO] AccountVerification já existe para user', user.id);
    }
    // Retorna o usuário já com o relacionamento populado
    return this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        freelancerProfile: true,
        clientProfile: true,
        accountVerification: true,
      },
    }) as Promise<PrismaUser>;
  }

  async findById(id: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        freelancerProfile: true,
        clientProfile: true,
        accountVerification: true,
      },
    });
  }

  async findByEmail(email: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        freelancerProfile: true,
        clientProfile: true,
        accountVerification: true,
      },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<PrismaUser> {
    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        freelancerProfile: true,
        clientProfile: true,
        accountVerification: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id }
      });
    } catch (error) {
      if (error.code === 'P2025' || error.message.includes('Record to delete does not exist')) {
        return;
      }
      throw error;
    }
  }

  async list({ page = 1, limit = 10 }: { page: number; limit: number }): Promise<{ users: PrismaUser[]; total: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.count()
    ]);

    return { users, total };
  }

  async findMany(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: Role;
    status?: Status;
    verified?: boolean;
  }): Promise<{ users: PrismaUser[]; total: number }> {
    const { page = 1, limit = 10, search, role, status, verified } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
      ...(role && { role }),
      ...(status && { status }),
      ...(verified !== undefined && { isEmailVerified: verified }),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          freelancerProfile: true,
          clientProfile: true,
          accountVerification: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total };
  }
} 