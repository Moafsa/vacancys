import { User as PrismaUser, Role as PrismaRole, Status as PrismaStatus } from '@prisma/client';
import { User as DomainUser, IUser } from '../../domain/entities/User';
import { UserRole } from '../../domain/enums/UserRole';
import { UserStatus } from '../../domain/enums/UserStatus';

// Funcao para mapear PrismaRole para UserRole de dominio
export function mapPrismaRoleToDomainRole(prismaRole: PrismaRole): UserRole {
  if (Object.values(UserRole).includes(prismaRole as any)) {
    return prismaRole as any; 
  } else {
    console.warn(`Unexpected Prisma Role: ${prismaRole}. Defaulting to UserRole.USER`);
    return UserRole.USER; 
  }
}

// Funcao para mapear PrismaStatus para UserStatus de dominio
export function mapPrismaStatusToDomainStatus(prismaStatus: PrismaStatus): UserStatus {
   if (Object.values(UserStatus).includes(prismaStatus as any)) {
    return prismaStatus as any; 
  } else {
     console.warn(`Unexpected Prisma Status: ${prismaStatus}. Defaulting to UserStatus.PENDING`);
     return UserStatus.PENDING;
  }
}

// Funcao para mapear PrismaUser para DomainUser de dominio
export function mapPrismaUserToDomainUser(prismaUser: PrismaUser): DomainUser {
  const userData: IUser = { // Criar objeto que implementa IUser
    id: prismaUser.id,
    email: prismaUser.email,
    password: prismaUser.password, 
    name: prismaUser.name,
    role: mapPrismaRoleToDomainRole(prismaUser.role), 
    status: mapPrismaStatusToDomainStatus(prismaUser.status),
    isEmailVerified: prismaUser.isEmailVerified,
    lastLoginAt: prismaUser.lastLoginAt,
    createdAt: prismaUser.createdAt,
    updatedAt: prismaUser.updatedAt,
    // Mapear outros campos presentes tanto em PrismaUser quanto em IUser
    // Se houverem campos na entidade de dominio que nao estao diretamente no PrismaUser,
    // pode ser necessario buscar/calcular ou definir valores padrao aqui.
    avatarUrl: prismaUser.avatarUrl || '', // Exemplo: valor padrao se null
    phone: prismaUser.phone || '',
    location: prismaUser.location || '',
    bio: prismaUser.bio || '',
    // Incluir mapeamento para relacionamentos (freelancerProfile, clientProfile, etc.) se eles existirem NA INTERFACE IUser
    // Se os relacionamentos nao estiverem na interface IUser, nao devem ser incluidos aqui no objeto userData para o construtor.
    // Ex: freelancerProfile: prismaUser.freelancerProfile ? mapPrismaFreelancerProfileToDomain(prismaUser.freelancerProfile) : undefined,
    // clientProfile: prismaUser.clientProfile ? mapPrismaClientProfileToDomain(prismaUser.clientProfile) : undefined,
  };

  // Passar o objeto IUser para o construtor da classe User
  const domainUser = new DomainUser(userData);

  return domainUser;
}

// Adicionar outras funcoes de mapeamento conforme necessario 