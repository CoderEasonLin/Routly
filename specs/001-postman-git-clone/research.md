# Research: API Client with Git Version Control

## 1. Desktop Framework (Electron vs Tauri vs Native Browser with Local Backend)
**Decision**: Native Browser with Local Backend (Vue + Express)

**Rationale**:
The user explicitly stated in a clarification: "If it's an application, and user can choose the git repo to open a collection, and let user push by themself." 
Furthermore, the project already has an existing `client/` (Vue 3) and `server/` (Express 5) structure as noted in `CLAUDE.md`.
Instead of introducing the overhead of Electron or Tauri, we can build this as a standard local web application. The user starts the Express server locally, which has full access to their local file system and native Git executable. They open the Vue frontend in their standard web browser (e.g., Chrome). The Vue frontend communicates with the Express backend via a REST API to read/write files and execute Git commands. This perfectly aligns with the requirement, uses the existing stack, and avoids native desktop packaging complexities.

**Alternatives considered**:
- **Electron**: Heavyweight, packages Chromium and Node.js. Unnecessary since the user is a developer who already has a browser and Node installed.
- **Tauri**: Lighter weight, but requires Rust knowledge and setup, which deviates from the Vue/Express stack currently in the repo.

## 2. Testing Framework for Vue + Backend Integration
**Decision**: Vitest (for Vue components & Core Libraries) + Supertest (for Express API)

**Rationale**:
- **Vitest**: The modern standard for Vue 3 testing. It is fast, native to Vite (which Vue 3 typically uses), and excellent for unit testing the core serialization libraries (as mandated by Constitution "I. Library-First" and "III. Test-First").
- **Supertest**: The industry standard for testing Express HTTP endpoints without starting a full server port. It allows testing the integration between the Express routes and the core Git/Storage libraries.

**Alternatives considered**:
- **Jest**: The older standard, but requires complex configuration to work well with modern Vue 3/Vite setups compared to Vitest.
- **Cypress/Playwright**: Great for end-to-end testing, but overkill for the initial library-first, test-first TDD approach mandated by the Constitution. We should focus on unit/integration tests first.
