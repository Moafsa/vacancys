import { UserRole } from '../enums/UserRole';
import { UserStatus } from '../enums/UserStatus';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
}

export class User implements IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;

  constructor(data: IUser) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.status = data.status;
    this.isEmailVerified = data.isEmailVerified;
    this.lastLoginAt = data.lastLoginAt;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.avatarUrl = data.avatarUrl;
    this.phone = data.phone;
    this.location = data.location;
    this.bio = data.bio;
  }

  verifyEmail(): void {
    this.isEmailVerified = true;
  }

  updateLastLogin(): void {
    this.lastLoginAt = new Date();
  }

  toJSON(): Omit<IUser, 'password'> {
    const { password: _password, ...userWithoutSensitiveData } = this;
    return userWithoutSensitiveData;
  }
} 