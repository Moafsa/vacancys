// Core exports: plug-in only, no server logic here!

// Services
export { AuthService } from './application/services/AuthService';
export { UserService } from './application/services/UserService';
export { EmailService } from './application/services/EmailService';
export { UserProfileService } from './application/services/UserProfileService';
export { FileUploadService } from './application/services/FileUploadService';

// Entities and Interfaces
export type { IUser } from './domain/entities/User';
export { User } from './domain/entities/User';
export { UserProfile } from './domain/entities/UserProfile';
// export { IUserRepository } from './domain/repositories/IUserRepository'; // Arquivo não encontrado

// Enums
export { UserRole } from './domain/enums/UserRole';
export { UserStatus } from './domain/enums/UserStatus';
export { ProfileType } from './domain/enums/ProfileType';

// Types
// export type { AuthTokenPayload, LoginResponse } from './application/services/AuthService'; // Verificar se existe
// export type { RegisterData } from './application/types/RegisterData'; // Arquivo não encontrado
// export type { AuthResponse } from './application/types/AuthResponse'; // Arquivo não encontrado

// Errors
// export { ApplicationError } from './application/errors/ApplicationError'; // Arquivo não encontrado

// Middleware
export { createValidateToken, requireRole } from './infrastructure/http/middleware/auth';
export { validate } from './infrastructure/http/middleware/validate';

// Repositories
export { UserRepository } from './infrastructure/repositories/UserRepository';

// Hooks registration
export { registerCoreHooks } from './hooks';

// Example: export { registerCoreHooks } from './hooks'; 