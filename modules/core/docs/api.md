# Core Module API Documentation

## Overview

The Core Module API provides a set of endpoints for managing system events, user authentication, and system status monitoring. This documentation describes the available endpoints, their parameters, response formats, and includes examples for common use cases.

## Base URL

All endpoints are prefixed with `/api/core`.

## Authentication

Most endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Status Endpoints

### Health Check

```
GET /status/health
```

Returns the current health status of the API.

**Authentication Required**: No

**Response**:

```json
{
  "status": "ok",
  "timestamp": "2023-03-26T21:26:28.261Z"
}
```

**Status Codes**:
- `200 OK`: Server is operational

### System Status

```
GET /status/json
```

Returns detailed system status information, including database connection status and configuration.

**Authentication Required**: No

**Response**:

```json
{
  "status": "OK",
  "timestamp": "2023-03-26T21:26:28.261Z",
  "environment": "development",
  "database": {
    "status": "Connected"
  },
  "config": {
    "email": {
      "host": "smtp.example.com",
      "port": 587,
      "secure": false,
      "auth": {
        "user": "******",
        "pass": "******"
      }
    },
    "redis": {
      "host": "localhost",
      "port": 6379,
      "auth": "******"
    }
  }
}
```

**Status Codes**:
- `200 OK`: Request successful
- `500 Internal Server Error`: Server error occurred

### Status Dashboard

```
GET /status
```

Returns an HTML page with system status information.

**Authentication Required**: No

**Response**: HTML content

**Status Codes**:
- `200 OK`: Request successful
- `404 Not Found`: Status page not found
- `500 Internal Server Error`: Server error occurred

## Authentication Endpoints

### User Login

```
POST /auth/login
```

Authenticates a user and returns a JWT token.

**Authentication Required**: No

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123456",
    "name": "User Name",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

**Status Codes**:
- `200 OK`: Authentication successful
- `400 Bad Request`: Invalid credentials
- `500 Internal Server Error`: Server error occurred

## User Endpoints

### Create User

```
POST /users
```

Creates a new user.

**Authentication Required**: Yes (Admin)

**Request Body**:

```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "securepassword",
  "role": "USER"
}
```

**Response**:

```json
{
  "id": "789012",
  "name": "New User",
  "email": "newuser@example.com",
  "role": "USER",
  "status": "ACTIVE",
  "createdAt": "2023-03-26T21:26:28.261Z",
  "updatedAt": "2023-03-26T21:26:28.261Z"
}
```

**Status Codes**:
- `201 Created`: User created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized
- `500 Internal Server Error`: Server error occurred

## Event Management Endpoints

### Get Event Service Metrics

```
GET /events/metrics
```

Returns metrics about the event service, including circuit breaker state and feature flags.

**Authentication Required**: Yes (Admin)

**Response**:

```json
{
  "status": "success",
  "data": {
    "circuitBreakerState": "CLOSED",
    "deadLetterQueueEnabled": true,
    "retryEnabled": true
  }
}
```

**Status Codes**:
- `200 OK`: Request successful
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized
- `500 Internal Server Error`: Server error occurred

### Get Dead Letter Queue Event Types

```
GET /events/dlq/types
```

Returns a list of event types in the Dead Letter Queue.

**Authentication Required**: Yes (Admin)

**Response**:

```json
{
  "status": "success",
  "data": {
    "eventTypes": ["ERROR_EVENT", "TIMEOUT_EVENT"],
    "count": 2
  }
}
```

**Status Codes**:
- `200 OK`: Request successful
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized
- `500 Internal Server Error`: Server error occurred

### Get Dead Letter Queue Events by Type

```
GET /events/dlq/:eventType
```

Returns a list of events of a specific type in the Dead Letter Queue.

**Authentication Required**: Yes (Admin)

**Path Parameters**:
- `eventType`: The type of events to retrieve

**Response**:

```json
{
  "status": "success",
  "data": {
    "events": [
      {
        "id": "123",
        "originalEvent": {
          "type": "ERROR_EVENT",
          "payload": { "message": "Error occurred" },
          "createdAt": "2023-03-26T21:26:28.261Z"
        },
        "failureReason": "Test failure",
        "attemptCount": 5,
        "lastAttemptAt": "2023-03-26T21:26:28.261Z",
        "createdAt": "2023-03-26T21:26:28.261Z"
      }
    ],
    "count": 1
  }
}
```

**Status Codes**:
- `200 OK`: Request successful
- `400 Bad Request`: Event type is required
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized
- `500 Internal Server Error`: Server error occurred

### Reprocess Dead Letter Queue Event

```
POST /events/dlq/:eventType/:eventId/reprocess
```

Reprocesses a specific event from the Dead Letter Queue.

**Authentication Required**: Yes (Admin)

**Path Parameters**:
- `eventType`: The type of the event to reprocess
- `eventId`: The ID of the event to reprocess

**Response**:

```json
{
  "status": "success",
  "message": "Event 123 reprocessed successfully"
}
```

**Status Codes**:
- `200 OK`: Event reprocessed successfully
- `400 Bad Request`: Event type and event ID are required
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized
- `404 Not Found`: Event not found or reprocessing failed
- `500 Internal Server Error`: Server error occurred

### Purge Dead Letter Queue Events

```
DELETE /events/dlq/:eventType
```

Purges all events of a specific type from the Dead Letter Queue.

**Authentication Required**: Yes (Admin)

**Path Parameters**:
- `eventType`: The type of events to purge

**Response**:

```json
{
  "status": "success",
  "message": "Purged 5 events of type ERROR_EVENT from Dead Letter Queue",
  "data": {
    "count": 5
  }
}
```

**Status Codes**:
- `200 OK`: Events purged successfully
- `400 Bad Request`: Event type is required
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized
- `500 Internal Server Error`: Server error occurred

## Error Responses

All API endpoints follow a consistent error response format:

```json
{
  "status": "error",
  "message": "Error message describing what went wrong",
  "stack": "Stack trace (only in development environment)"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Clients exceeding the rate limit will receive a `429 Too Many Requests` response.

## Paginação

A API suporta paginação para endpoints que retornam listas de itens, como eventos da Dead Letter Queue. 

### Parâmetros de Paginação

Para endpoints que suportam paginação, você pode incluir os seguintes parâmetros na query string da URL:

- `page`: número da página (começa em 1)
- `limit`: quantidade de itens por página (padrão: 10, máximo: 100)

Exemplo:
```
GET /api/core/events/dlq/ERROR_EVENT?page=2&limit=20
```

### Resposta Paginada

Quando a paginação é aplicada, a resposta incluirá metadados de paginação:

```json
{
  "status": "success",
  "data": {
    "events": [...],
    "count": 20
  },
  "pagination": {
    "total": 85,
    "page": 2,
    "limit": 20,
    "pages": 5,
    "hasNext": true,
    "hasPrev": true
  }
}
```

Os metadados de paginação incluem:

- `total`: número total de itens disponíveis
- `page`: página atual 
- `limit`: limite de itens por página
- `pages`: número total de páginas
- `hasNext`: indica se há uma próxima página
- `hasPrev`: indica se há uma página anterior

### Endpoints com Suporte a Paginação

Os seguintes endpoints suportam paginação:

- `GET /api/core/events/dlq/:eventType` - Listar eventos da Dead Letter Queue por tipo 