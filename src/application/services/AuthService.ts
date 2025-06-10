import { IUserRepository, UserRepository } from '../../../modules/core/src/infrastructure/repositories/UserRepository';
import { prisma } from '../../../src/lib/prisma';

export class AuthService {
  private userRepository: IUserRepository;

  constructor(userRepository?: IUserRepository) {
    this.userRepository = userRepository || new UserRepository(prisma);
  }

  public getUserRepository(): IUserRepository {
    return this.userRepository;
  }
} 