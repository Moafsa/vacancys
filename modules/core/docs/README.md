# Core Module API Documentation

Welcome to the Core Module API documentation. This folder contains comprehensive documentation for the Core Module API, which provides endpoints for authentication, event management, and system status monitoring.

## Documentation Files

- [API Reference](api.md) - Detailed documentation for all endpoints
- [OpenAPI Specification](openapi.yaml) - OpenAPI 3.0 specification for the API
- [API Examples](api-examples.md) - Code examples for interacting with the API using different languages

## Quick Start

To start using the API:

1. Make sure the system is running
2. Send a request to the health check endpoint to verify connectivity:
   ```
   GET /api/core/status/health
   ```
3. Authenticate using the login endpoint to get a token:
   ```
   POST /api/core/auth/login
   ```
4. Use the token in subsequent authenticated requests

## Key Features

- **Authentication** - Secure JWT-based authentication
- **User Management** - Create and manage users
- **Event System** - Monitor and manage the event messaging system
- **Dead Letter Queue** - Manage failed events through the Dead Letter Queue
- **Status Monitoring** - Check system status and health

## Authentication

Most API endpoints require authentication. To authenticate, include the JWT token in the Authorization header:

```
Authorization: Bearer your-token-here
```

## Error Handling

All API endpoints return consistent error responses with the following format:

```json
{
  "status": "error",
  "message": "Error message describing what went wrong"
}
```

## Pagination

Endpoints that return lists of items support pagination using the following query parameters:

- `page`: Page number (starting from 1)
- `limit`: Number of items per page

Example:
```
GET /api/core/users?page=2&limit=10
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Clients exceeding the rate limit will receive a `429 Too Many Requests` response.

## Development

If you're developing against this API, consider using the [OpenAPI specification](openapi.yaml) to generate client libraries for your programming language of choice.

For questions or issues, please contact the system administrators. 