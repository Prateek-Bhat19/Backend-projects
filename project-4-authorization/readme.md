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
