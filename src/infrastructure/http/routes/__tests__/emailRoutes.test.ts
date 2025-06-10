const mockUser = {
  id: '123',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
  isEmailVerified: true,
  lastLoginAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
};

const verifiedUser = {
  id: '123',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
  isEmailVerified: true,
  lastLoginAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
};

const unverifiedUser = {
  id: '123',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
  isEmailVerified: false,
  lastLoginAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
}; 