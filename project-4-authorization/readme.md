Authorization Service (RBAC + Ownership) — Express, TypeScript, MongoDB
Overview

This project implements a secure authorization layer on top of an existing authentication system using JWT, Role-Based Access Control (RBAC), and resource ownership rules.

The goal is to demonstrate correct backend authorization design, including:

Clear separation of authentication vs authorization

Correct HTTP semantics (401 vs 403)

Middleware-driven access control

Admin-only privilege escalation

Ownership enforcement with admin override

The system is intentionally stateless, modular, and testable.

Core Concepts
1. Authentication (Who are you?)

Authentication is handled using JWT access tokens.

Users authenticate via /auth/login or /auth/register

On success, the server issues a JWT containing:

{
  "id": "<userId>",
  "role": "user | admin"
}


Tokens are sent by clients using:

Authorization: Bearer <token>


Authentication middleware:

Verifies the token

Attaches req.user = { id, role }

Rejects unauthenticated requests with 401 Unauthorized

Authentication answers identity, not permissions.

2. Authorization (Are you allowed to do this?)

Authorization is implemented using Role-Based Access Control (RBAC).

Roles:

user

admin

Authorization middleware:

Runs after authentication

Checks whether req.user.role is allowed for the route

Rejects insufficient permissions with 403 Forbidden

Example rule:

Users can create and read notes

Only admins can access admin routes

Routes declare intent, middleware enforces policy.

3. Ownership (Is this resource yours?)

RBAC alone is not sufficient for resource-level security.

Ownership rules enforce:

A user can only access their own resources

An admin can access any resource

Ownership is implemented as a dedicated middleware that:

Fetches the resource

Verifies ownership

Allows admin override

Attaches the resource to the request for controller use

This keeps controllers clean and avoids duplicated logic.

4. Admin Role Management (Controlled Privilege Escalation)

Role changes are explicit and restricted.

Rules:

Clients cannot assign roles

Registration always creates user

Only admins can promote or demote users

Admins cannot change their own role

Role updates happen via a dedicated admin-only endpoint, ensuring:

No silent privilege escalation

Clear audit surface

Predictable authorization flow

5. Error Handling & HTTP Semantics

The application uses a centralized error handler.

Rules:

401 Unauthorized → authentication failure (missing/invalid token)

403 Forbidden → authorization or ownership failure

400 → validation errors

404 → missing resources

500 → server errors

Controllers throw semantic errors; the error handler translates them into HTTP responses.

This guarantees consistent and meaningful API behavior.

Request Lifecycle (End-to-End)
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
  → business logic only
  ↓
Global Error Handler


Each layer has a single responsibility.

Security Characteristics

Stateless JWT authentication

No role assignment from client input

No authorization logic in controllers

Explicit admin-only privilege escalation

Ownership enforced at middleware level

Correct separation of concerns

The design mirrors real-world backend authorization systems.

Testing Strategy

All critical paths are verified via:

Authentication tests

Authorization (401 vs 403) tests

Ownership enforcement tests

Admin-only route tests

Role promotion tests

This ensures authorization behavior is provably correct, not assumed.

Summary

This project demonstrates a production-grade authorization architecture using Express, TypeScript, and MongoDB.

It focuses on:

Correct security boundaries

Middleware-driven design

Clean, testable code

Clear and predictable access rules

The result is a backend service that is secure, extensible, and suitable as a foundation for larger systems.