# NestJS Practice Application

A hands-on [NestJS](https://nestjs.com/) practice project demonstrating core framework concepts and architectural patterns, including modules, controllers, services, dependency injection, DTO request validation, custom interceptors, middleware, and authorization guards.

---

## Table of Contents

- [Features](#features)
- [Architecture & Core Concepts](#architecture--core-concepts)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Nest CLI & Setup Commands](#nest-cli--setup-commands)
- [API Reference](#api-reference)
  - [Headers](#headers)
  - [Endpoints](#endpoints)
  - [Response Format](#response-format)
- [Observability](#observability)
- [License](#license)

---

## Features

- **Modular Architecture**: Clean separation of concerns with encapsulated modules (`UserModule`).
- **RESTful Endpoints**: Full CRUD operations for user management.
- **Request Validation & Serialization**: DTOs powered by `class-validator` and `class-transformer` via global `ValidationPipe`.
- **Response Transformation**: Global interceptor (`TransformInterceptor`) standardizing all API responses into a unified response schema.
- **Custom Middleware**: Header-based API key validation (`ApiKeyMiddleware`) protecting routes.
- **Role-Based Guards**: Authorization checks (`RoleGuard`) restricting sensitive operations (e.g., user deletion).
- **Custom Logging**: Injectable logger service demonstrating NestJS dependency injection.
- **Observability**: Integrated with [NestJS Observe](https://observe.nestjs.com) for distributed tracing, metrics, and error tracking.

---

## Architecture & Core Concepts

| Concept | File Location | Purpose |
| :--- | :--- | :--- |
| **Module** | `src/user/user.module.ts` | Bundles controller, services, and providers into an isolated domain. |
| **Controller** | `src/user/user.controller.ts` | Handles incoming HTTP requests and routes (`/user`). |
| **Service** | `src/user/user.service.ts` | Contains business logic and in-memory data store. |
| **DTO & Validation** | `src/user/dto/create-user.dto.ts` | Defines data shapes and validates input payloads using decorators. |
| **Interceptor** | `src/utils/transform.interceptor.ts` | Modifies outgoing responses to wrap them in `{ statusCode, message, data }`. |
| **Middleware** | `src/middleware/api-key.middleware.ts` | Inspects headers before requests reach route handlers (`x-api-key`). |
| **Guard** | `src/guards/role.guard.ts` | Protects routes based on authorization criteria (`role: admin`). |

---

## Project Structure

```text
src/
├── guards/
│   ├── role.guard.spec.ts
│   └── role.guard.ts              # Authorization guard checking role headers
├── middleware/
│   ├── api-key.middleware.spec.ts
│   └── api-key.middleware.ts      # Verifies 'x-api-key' header for /user routes
├── user/
│   ├── dto/
│   │   ├── create-user.dto.ts     # Input validation rules (name, email)
│   │   └── update-user.dto.ts     # Partial update validation
│   ├── user.controller.spec.ts
│   ├── user.controller.ts         # User routes & endpoints
│   ├── user.logger.ts             # Custom injectable logger service
│   ├── user.module.ts             # User domain module
│   ├── user.service.spec.ts
│   └── user.service.ts            # Business logic and user data store
├── utils/
│   ├── transform.interceptor.spec.ts
│   └── transform.interceptor.ts   # Global response wrapper interceptor
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts                  # Root application module & middleware configuration
├── app.service.ts
└── main.ts                        # Application bootstrap, global pipes & interceptors
```

---

## Prerequisites

- **Node.js**: Version `20.19+` or `22.12+` (LTS recommended)
- **npm**: Version `10+` (bundled with Node.js)
- **Nest CLI** (optional, for running generators globally):
  ```bash
  npm install -g @nestjs/cli
  ```

---

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd nestjs-practice
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   PORT=3000
   OBSERVE_APP_KEY=YOUR_APP_KEY
   OBSERVE_APP_SECRET=YOUR_APP_SECRET
   ```
   *(Note: NestJS Observe keys are optional for local development)*

---

## Running the Application

```bash
# Development mode with hot-reload (recommended)
npm run start:dev

# Standard start
npm run start

# Debug mode
npm run start:debug

# Production mode
npm run start:prod
```

The application will start on `http://localhost:3000` (or the port specified in `.env`).

---

## Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:cov

# Run end-to-end (e2e) tests
npm run test:e2e
```

---

## Nest CLI & Setup Commands

Below are the key commands used during the creation and development of this project, along with their usage and explanation:

### 1. Generate User Module
```bash
nest g module user
```
- **Output:** Creates `src/user/user.module.ts` and imports it into `AppModule` (`src/app.module.ts`).
- **Usage:** Organizes the user feature into a dedicated module that encapsulates its controllers, providers, and exported services.

### 2. Generate User Controller
```bash
nest g controller user
```
- **Output:** Creates `src/user/user.controller.ts` and `src/user/user.controller.spec.ts`, and registers the controller in `UserModule`.
- **Usage:** Handles incoming HTTP traffic, routes endpoints (`/user`), and maps incoming parameters, bodies, and queries to service methods.

### 3. Generate User Service
```bash
nest g service user
```
- **Output:** Creates `src/user/user.service.ts` and `src/user/user.service.spec.ts`, and adds it as a provider in `UserModule`.
- **Usage:** Implements the core business logic, in-memory state management, and data retrieval for users.

### 4. Generate Transform Interceptor
```bash
nest g interceptor utils/transform --flat
```
- **Output:** Creates `src/utils/transform.interceptor.ts` and `src/utils/transform.interceptor.spec.ts` directly inside `src/utils/` (without creating a nested `transform/` directory, thanks to `--flat`).
- **Usage:** Intercepts outgoing HTTP execution streams using RxJS (`map`) to wrap every successful response in a consistent schema (`{ statusCode, message: 'Success', data }`). Applied globally in `main.ts` via `app.useGlobalInterceptors(new TransformInterceptor())`.

### 5. Install Validation Packages
```bash
npm i class-validator class-transformer
```
- **Output:** Installs `class-validator` and `class-transformer` into `dependencies`.
- **Usage:** Enables decorator-based validation for request bodies (DTOs) such as `@IsString()`, `@MinLength()`, and `@IsEmail()`. Combined with `app.useGlobalPipes(new ValidationPipe())` in `main.ts`, automatically validates incoming requests and throws `400 Bad Request` on failure.

### 6. Generate API Key Middleware
```bash
nest g middleware middleware/api-key --flat
```
- **Output:** Creates `src/middleware/api-key.middleware.ts` and `src/middleware/api-key.middleware.spec.ts` directly in `src/middleware/`.
- **Usage:** Intercepts incoming requests before reaching route handlers. Implements `NestMiddleware` to check for the `x-api-key` header (`secret-key-123`). Registered in `app.module.ts` for all `/user` routes via `consumer.apply(ApiKeyMiddleware).forRoutes(UserController)`.

### 7. Generate Role Guard
```bash
nest g guard guards/role --flat
```
- **Output:** Creates `src/guards/role.guard.ts` and `src/guards/role.guard.spec.ts` directly in `src/guards/`.
- **Usage:** Implements `CanActivate` to restrict route access based on permissions. Checks that the request contains the `role: admin` header before granting access. Bound to sensitive operations like `DELETE /user/:id` using `@UseGuards(RoleGuard)`.

---

## API Reference

### Headers

All `/user` endpoints require the API key header:
- `x-api-key: secret-key-123`

Protected endpoints (e.g., `DELETE /user/:id`) additionally require:
- `role: admin`

---

### Endpoints

| Method | Endpoint | Description | Required Headers | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | App root welcome message | None | None |
| `GET` | `/user` | Get all users (filterable via query `?name=...`) | `x-api-key: secret-key-123` | None |
| `GET` | `/user/:id` | Get user by ID | `x-api-key: secret-key-123` | None |
| `POST` | `/user` | Create new user | `x-api-key: secret-key-123` | `{ "name": "string", "email": "string" }` |
| `PUT` | `/user/:id` | Update existing user | `x-api-key: secret-key-123` | `{ "name"?: "string", "email"?: "string" }` |
| `DELETE` | `/user/:id` | Delete user by ID | `x-api-key: secret-key-123`<br>`role: admin` | None |

---

### Response Format

Thanks to `TransformInterceptor`, all successful responses return in a standardized structure:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "amit",
      "email": "amit@gmail.com"
    },
    {
      "id": 2,
      "name": "shubham",
      "email": "shubham@gmail.com"
    }
  ]
}
```

If validation fails (via `ValidationPipe`), NestJS automatically returns a descriptive `400 Bad Request`:

```json
{
  "message": [
    "name must be longer than or equal to 3 characters",
    "email must be an email"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## Observability

This application is instrumented with **[NestJS Observe](https://observe.nestjs.com)** for distributed tracing, auto-correlated logs, and performance metrics.

To link your application:
```bash
npx @nestjs/observe link
```
Follow the interactive prompt to authenticate. It will automatically write your `OBSERVE_APP_KEY` and `OBSERVE_APP_SECRET` to `.env`.

---

## License

This project is [MIT licensed](LICENSE).
