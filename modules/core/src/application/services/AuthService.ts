import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User as DomainUser, IUser } from '../../domain/entities/User';
import { IUserRepository } from '../../infrastructure/repositories/UserRepository';
import { mapPrismaUserToDomainUser } from '../../infrastructure/adapters/PrismaCoreAdapter';
import { UserStatus } from '../../domain/enums/UserStatus';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: DomainUser['role'];
}

export interface LoginResponse {
  user: Omit<IUser, 'password'>;
  token: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export class AuthService {
  private userRepository: IUserRepository;
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
  }

  getUserRepository(): IUserRepository {
    return this.userRepository;
  }

  async register(data: RegisterData): Promise<DomainUser> {
    const existingPrismaUser = await this.userRepository.findByEmail(data.email);
    if (existingPrismaUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const createdPrismaUser = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const domainUser = mapPrismaUserToDomainUser(createdPrismaUser);

    return domainUser;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const prismaUser = await this.userRepository.findByEmail(email);

    if (!prismaUser) {
      throw new Error('Invalid credentials');
    }

    const user = mapPrismaUserToDomainUser(prismaUser);

    if (user.status !== UserStatus.ACTIVE) {
      throw new Error('Account is not active');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const updatedPrismaUser = await this.userRepository.update(user.id, { lastLoginAt: new Date() } as any);
    
    const updatedUser = mapPrismaUserToDomainUser(updatedPrismaUser);

    const token = this.generateToken(updatedUser);

    const userWithoutPassword: Omit<IUser, 'password'> = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      isEmailVerified: updatedUser.isEmailVerified,
      lastLoginAt: updatedUser.lastLoginAt,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      avatarUrl: updatedUser.avatarUrl,
      phone: updatedUser.phone,
      location: updatedUser.location,
      bio: updatedUser.bio,
    };

    return {
      user: userWithoutPassword,
      token
    };
  }

  async verifyEmail(userId: string): Promise<void> {
    const prismaUser = await this.userRepository.findById(userId);
    if (!prismaUser) {
      throw new Error('User not found');
    }

    const user = mapPrismaUserToDomainUser(prismaUser);

    await this.userRepository.update(user.id, {
      isEmailVerified: true
    } as any);
  }

  async resetPassword(email: string): Promise<void> {
    const prismaUser = await this.userRepository.findByEmail(email);
    if (!prismaUser) {
      throw new Error('User not found');
    }

    // Gerar token de reset e enviar email
  }

  async validateToken(token: string): Promise<AuthTokenPayload | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string, email: string, role: string };
      
      const prismaUser = await this.userRepository.findById(decoded.userId);
      if (!prismaUser) return null;

      const user = mapPrismaUserToDomainUser(prismaUser);

      const payload: AuthTokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      return payload;
    } catch (error) {
      return null;
    }
  }

  private generateToken(user: DomainUser): string {
    const payload: AuthTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn
    } as jwt.SignOptions);
  }
} 