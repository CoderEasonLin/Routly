# Tasks: API Client with Git Version Control

**Input**: Design documents from `/specs/001-postman-git-clone/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for the local web app (Vue + Express)

- [x] T001 Initialize Vue 3 frontend project in `client/`
- [x] T002 Initialize Express 5 backend project in `server/`
- [x] T003 [P] Configure Vitest testing framework in `client/` and `server/`
- [x] T004 [P] Configure basic REST API contracts according to `contracts/rest-api.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T005 Setup Express routing and basic error handling middleware in `server/src/index.js`
- [x] T006 Setup HTTP Request Engine wrapper in `server/src/core/http/` (to execute generic requests)
- [x] T007 Implement basic file storage serialization/deserialization logic in `server/src/core/storage/`
- [x] T008 Implement native Git command wrapper in `server/src/core/git/` (status, add, commit)
- [x] T009 Create base Vue components structure (Layout, Sidebar, Main panel) in `client/src/`

**Checkpoint**: ✅ Foundation ready - both HTTP execution and local file/git access are unblocked.

---

## Phase 3: User Story 1 - Create and Send API Requests (Priority: P1)

**Goal**: As an API developer, I want to create, configure, and send HTTP requests to test API endpoints.
**Independent Test**: Can be fully tested by starting the app, entering a public API URL, selecting GET, clicking send, and verifying response.

### Implementation for User Story 1

- [x] T010 [P] [US1] Create Request data model entity in `client/src/store/state.js`
- [x] T011 [P] [US1] Create Workspace directory reading API endpoint `GET /api/workspace/tree` in `server/src/api/`
- [x] T012 [P] [US1] Create Request Editor UI component (URL, Method, Headers, Body) in `client/src/components/RequestEditor.vue`
- [x] T013 [P] [US1] Create Response Viewer UI component (Status, Headers, Body) in `client/src/components/ResponseViewer.vue`
- [x] T014 [US1] Implement request execution via Vue service calling the backend HTTP engine.
- [x] T015 [US1] Integrate Editor and Viewer into `client/src/App.vue`

**Checkpoint**: ✅ Application can send stateless HTTP requests.

---

## Phase 4: User Story 2 - Local Workspace Versioning (Priority: P1)

**Goal**: As a developer, I want my API requests to be version-controlled locally to track changes.
**Independent Test**: Can be fully tested by modifying a request, making a commit via UI, and viewing local history.

### Implementation for User Story 2

- [x] T016 [P] [US2] Implement Workspace selection via OS dialog endpoint (`POST /api/dialog/open-folder`) in `server/src/api/dialog.js`
- [x] T017 [P] [US2] Create Git Panel UI component (Status, Stage, Commit message) in `client/src/components/GitPanel.vue`
- [x] T018 [US2] Implement API endpoints for writing request files to disk (`POST /api/file/write`)
- [x] T019 [US2] Implement API endpoints for Git commit (`POST /api/git/commit`) and Git status (`GET /api/workspace/status`)
- [x] T020 [US2] Connect Git Panel to backend endpoints to commit changes.
- [x] T021 [US2] Implement Git history retrieval (`GET /api/git/log`) and History UI view.

**Checkpoint**: ✅ Application can now save requests to disk and commit them natively.

---

## Phase 5: User Story 4 - Environment Variables Management (Priority: P2)

**Goal**: As a developer, I want to configure environment variables so that I can run requests against different environments.
**Independent Test**: Can be tested by creating a `token` variable, using `{{token}}` in a request, and ensuring the request executes normally. Local values must not be committed.

### Implementation for User Story 4

- [x] T022 [P] [US4] Create Environment data model and substitution logic in `client/src/utils/env-parser.js`
- [x] T023 [P] [US4] Create Environment Manager UI component in `client/src/components/EnvManager.vue`
- [x] T024 [US4] Implement special `.gitignore` or filtering logic in the backend storage engine to ignore `localValue` properties during serialization.
- [x] T025 [US4] Hook up environment substitution into the Request execution pipeline before dispatching to the HTTP engine.

**Checkpoint**: ✅ Variables can be swapped and safely excluded from Git.

---

## Phase 6: User Story 3 - Remote Syncing and Collaboration (Priority: P2)

**Goal**: As a team member, I want to push my API collections to a remote git repository and pull changes.
**Independent Test**: Connect a remote URL using standard OS Git config, push local commits, and verify on remote.

### Implementation for User Story 3

- [x] T026 [US3] Implement native Git Push and Pull wrappers in `server/src/core/git/`
- [x] T027 [US3] Create Push/Pull API endpoints (`POST /api/git/push`, `POST /api/git/pull`)
- [x] T028 [US3] Add Sync buttons and loading states to the Git Panel UI.
- [x] T029 [US3] Display merge conflict status or errors in the UI if pull fails.

**Checkpoint**: ✅ Application provides full remote sync capability.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T030 [P] Implement loading states and error toasts across all UI actions.
- [x] T031 Refactor backend error responses to use a consistent format.
- [ ] T032 Write unit tests for the regex substitution logic in Environment parser.
- [ ] T033 Write unit tests for local file serialization round-tripping.
- [ ] T034 Run `quickstart.md` documentation validation (if applicable).
