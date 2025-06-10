# Vacancy Project

> NOTE: All database management (schema, migrations, seed) must be done exclusively via the `prisma/` folder at the project root. All modules must depend on this centralized schema. Do not create or maintain separate Prisma schemas or migrations in any module.

# Vacancy.services

A modular monolith platform for connecting freelancers and clients, built with Next.js and Node.js.

## Project Overview

Vacancy.service is a comprehensive platform designed to facilitate connections between freelancers and clients through a modular monolith architecture (MCP). Each module has its own database and specific responsibilities, enabling scalability, simplified maintenance, and future module replacement if needed.

## Core Features

- **Authentication System**: Complete user authentication flow with email verification
- **Project Management**: Post projects, receive proposals, and manage contracts
- **Payment Processing**: Secure payment handling with escrow system
- **Real-time Communication**: Messaging with multi-language translation
- **AI-powered Matching**: Smart project recommendations based on skills and preferences
- **Credits System**: Daily credits for freelancers to submit proposals
- **Virtual Meetings**: Built-in meeting rooms with real-time translation
- **Review System**: Transparent feedback system for clients and freelancers
- **Skills Verification**: Tests and certifications for freelancers

## Modular Architecture

The system is divided into autonomous modules, each with:
- **Independent database** (separate schema or different technology)
- **Internal API** for inter-module communication (via events, REST, or messaging)
- **Isolated dependencies** (e.g., payments module doesn't depend on AI module)

### Module Structure

| Module | Responsibility | Technologies |
|--------|----------------|--------------|
| **Core** | Authentication, profiles, global settings | Next.js, Auth.js, PostgreSQL |
| **Projects** | Project posting, proposals, management | MongoDB, Elasticsearch |
| **Payments** | Payment processing, escrow | Stripe API, MongoDB |
| **Messaging** | User communication, notifications | Socket.io, Redis |
| **Reviews** | Freelancer and client evaluations | PostgreSQL |
| **Skills** | Skills management and testing | PostgreSQL, External API |
| **Admin** | Admin panel, user management | Next.js, React Admin |
| **Analytics** | Platform metrics and statistics | ClickHouse, Grafana |
| **AI Translation** | Real-time message translation | Python, FastAPI, Redis, OpenAI |
| **Meetings** | Meeting rooms, interviews | WebRTC, Socket.io, MongoDB, OpenAI |
| **AI Matchmaking** | Project/freelancer matching | Python, TensorFlow, Redis |
| **Credits** | Credits system for proposals | PostgreSQL, Redis, Node.js |
| **Security** | Security, audits, compliance | Node.js, ELK Stack, HashiCorp Vault |
| **Localization** | System internationalization | i18next, PostgreSQL, Redis |
| **Affiliates** | Referral program and commissions | PostgreSQL, Node.js |
| **Integration Hub** | External platform integrations | MongoDB, Redis |

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/Moafsa/Vacancy.service.git
cd Vacancy.service
```

2. Set up environment variables (create a `.env` file):
```
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/vacancy_service?schema=public"
JWT_SECRET="your_jwt_secret"
PORT=3002
NODE_ENV=development
```

3. Install dependencies:
```bash
npm install
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

## Module Development

### Core Module

The Core module is currently implemented with the following features:
- User authentication (register, login, password recovery)
- Profile management (freelancer and client)
- Role-based authorization
- Multi-factor authentication
- OAuth provider integration

To work with the Core module:

```bash
cd modules/core
npm install
npm run dev
```

### Module Development Guidelines

When developing modules, follow these guidelines:
- Each module should be self-contained with its own database schema
- Communication between modules should happen through the event system
- Follow the Clean Architecture principles within each module
- Write comprehensive tests for all functionality
- Document APIs using OpenAPI/Swagger

## Testing

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Check test coverage
npm run test:coverage
```

## API Documentation

The API documentation is available at `/api/docs` when running the development server.

## Contributing

We welcome contributions to Vacancy.service! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
