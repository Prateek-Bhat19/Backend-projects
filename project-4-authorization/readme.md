# Authorization Service (RBAC + Ownership)

## Overview

This project implements a **secure authorization layer** on top of an existing authentication system using **JWT, Role-Based Access Control (RBAC), and resource ownership rules**.

The goal is to demonstrate **correct backend authorization design**, including:

- Clear separation of authentication vs authorization
- Correct HTTP semantics (`401` vs `403`)
- Middleware-driven access control
- Admin-only privilege escalation
- Ownership enforcement with admin override

The system is **stateless**, **modular**, and **testable**.

---

## Authentication (Who are you?)

Authentication is handled using **JWT access tokens**.

- Users authenticate via `/auth/register` and `/auth/login`
- On successful authentication, the server issues a JWT containing:

```json
{
  "id": "<userId>",
  "role": "user | admin"
}

Tokens are sent with each request using:

Authorization: Bearer <token>


The authentication middleware:

Verifies the JWT

Attaches req.user = { id, role }

Rejects unauthenticated requests with 401 Unauthorized

Authentication establishes identity, not permissions.

Authorization (Are you allowed to do this?)

Authorization is implemented using Role-Based Access Control (RBAC).

Roles

user

admin

Authorization middleware:

Runs after authentication

Checks whether req.user.role is allowed for the route

Rejects insufficient permissions with 403 Forbidden

Examples:

Users can create and read their notes

Only admins can access admin routes

Routes declare intent; middleware enforces policy.

Ownership (Is this resource yours?)

RBAC alone is not sufficient for resource-level security.

Ownership rules enforce:

A user can only access their own resources

An admin can access any resource

Ownership is implemented via middleware that:

Fetches the resource

Verifies ownership

Allows admin override

Attaches the resource to the request

This keeps controllers clean and avoids duplicated logic.

Admin Role Management

Role changes are explicit and restricted.

Rules:

Clients cannot assign roles

Registration always creates a user

Only admins can promote or demote users

Admins cannot change their own role

Role updates happen via a dedicated admin-only endpoint, preventing silent privilege escalation.

Error Handling & HTTP Semantics

The application uses a centralized error handler.

Status code rules:

401 Unauthorized → authentication failure

403 Forbidden → authorization or ownership failure

400 Bad Request → validation errors

404 Not Found → missing resources

500 Internal Server Error → server errors

Controllers throw semantic errors; the error handler converts them into HTTP responses.

Request Lifecycle
Request
  ↓
Authentication Middleware
  → 401 if token missing/invalid
  ↓
Authorization Middleware (RBAC)
  → 403 if role not allowed
  ↓
Ownership Middleware (if applicable)
  → 403 if resource not owned
  ↓
Controller
  ↓
Global Error Handler


Each layer has a single responsibility.
