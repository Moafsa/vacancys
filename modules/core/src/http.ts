import express from 'express';
import { AuthRoutes } from './infrastructure/http/routes/authRoutes';
import { userRoutes } from './infrastructure/http/routes/userRoutes';
import { UserService } from './application/services/UserService';
import { UserRepository } from './infrastructure/repositories/UserRepository';
import { EventEmitter } from 'events';
import moduleManagementRoutes from './infrastructure/http/routes/moduleManagementRoutes';
import { PrismaClient } from '@prisma/client';
// Importe outros grupos de rotas do core conforme necessário

/**
 * Registra todas as rotas e middlewares HTTP do core na instância do Express fornecida.
 * Deve ser chamada pelo host para plugar o core.
 * Recebe as dependências necessárias para inicializar os serviços e repositórios.
 */
export function registerCoreHttp(app: express.Application, prisma: PrismaClient, eventEmitter: EventEmitter) {
  // Rotas de autenticação - Note: AuthRoutes pode precisar receber dependências também se usar serviços/repositórios
  const authRoutes = new AuthRoutes(); // Verifique se AuthRoutes precisa de dependências
  app.use('/api/v1/auth', authRoutes.getRouter());

  // Repositório e Serviços com dependência injetada
  const userRepository = new UserRepository(prisma);
  const userService = new UserService(userRepository, eventEmitter);

  // Rotas de usuário usando os serviços e repositórios injetados
  app.use('/api/v1/users', userRoutes(userService, userRepository));

  // Rotas de gerenciamento de módulos
  app.use('/api/v1', moduleManagementRoutes); // Verifique se moduleManagementRoutes precisa de dependências

  // Adicione aqui outros grupos de rotas do core (ex: profiles, emails, etc.) e injete as dependências necessárias
}

// Assumindo que 'userRoutes' e definido em outro lugar e exporta uma funcao que configura as rotas
// function userRoutes(userService: UserService, userRepository: IUserRepository): express.Router { ... } 