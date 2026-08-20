# Problem Service

Problem management microservice for **DevTrails**, a distributed online coding platform.

The Problem Service is responsible for managing coding problems, their metadata, test cases, and editorial content. It exposes APIs consumed by the frontend and other internal services such as the Submission and Judge services.

## Responsibilities

The Problem Service manages:

- Problem creation
- Problem retrieval
- Problem updates
- Problem deletion
- Problem metadata
- Difficulty levels
- Problem tags
- Test cases
- Editorial content
- Markdown processing
- HTML sanitization
- Role-based access control

The service owns the problem-related data and other services interact with it through APIs instead of directly accessing its database.

## Architecture

The service follows a layered architecture:

```text
Client / Internal Service
        │
        ▼
   Auth Middleware
        │
        ▼
  Authorization
        │
        ▼
   Zod Validation
        │
        ▼
    Controller
        │
        ▼
     Service
        │
        ▼
   Repository
        │
        ▼
    Database