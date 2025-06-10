import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { EventEmitter } from 'events';
import { Role, Status } from '@prisma/client';
import bcrypt from 'bcryptjs';

export class UserService {
  private userRepository: UserRepository;
  private eventEmitter: EventEmitter;

  constructor(userRepository: UserRepository, eventEmitter: EventEmitter) {
    this.userRepository = userRepository;
    this.eventEmitter = eventEmitter;
  }

  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: Role;
    status?: Status;
    verified?: boolean;
  }) {
    const { users, total } = await this.userRepository.findMany(params);
    const { page = 1, limit = 10 } = params;
    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(id: string) {
    return this.userRepository.findById(id);
  }

  async updateUserStatus(id: string, status: Status) {
    return this.userRepository.update(id, { status });
  }

  async deleteUser(id: string) {
    return this.userRepository.delete(id);
  }

  async updateUser(id: string, data: Partial<{ name: string; email: string; role: Role; status: Status; password?: string }>) {
    const allowedFields: (keyof typeof data)[] = ['name', 'email', 'role', 'status', 'password'];
    const updateData: any = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    return this.userRepository.update(id, updateData);
  }

  async createUser(data: { name: string; email: string; password: string; role: Role; status: Status }) {
    data.password = await bcrypt.hash(data.password, 10);
    return this.userRepository.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      status: data.status,
      isEmailVerified: false,
    });
  }
} 