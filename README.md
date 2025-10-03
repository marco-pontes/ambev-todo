# Ambev Todo

A modern React task manager showcasing a full CRUD flow for Todos with pagination, status changes (Pending/Completed), creation, editing and deletion. It uses a modular local API powered by @marco-pontes/simple-fake-api (under api/) and also ships with an optional MirageJS mock server. The UI is built with Chakra UI and TanStack libraries (Router, Query, Table). End-to-end tests run with Playwright and unit tests with Vitest.

Quick start (most common commands)
- npm run setup — one-time Playwright browser install + small repo setup
- npm run start — starts Vite dev server and the local API together (concurrently)
- npm run test:unit — run unit tests (Vitest)
- npm run test:e2e — run Playwright E2E tests
- npm run test — run both unit and e2e tests

Technologies/libraries
- React 19, Vite 7, TypeScript 5
- Chakra UI 3, React Hook Form, Zod
- TanStack Router, TanStack Query, TanStack Table (+ Devtools)
- i18next with react-i18next (multi-language)
- Playwright for E2E, Vitest + Testing Library for unit
- @marco-pontes/simple-fake-api for local HTTP API
- MirageJS optional mock server (scripts/server.ts)

Special note about the API
- The project ships with @marco-pontes/simple-fake-api for simplicity and modularity/scalability of routes defined under the api/ folder.
- MirageJS is also available in scripts/server.ts. To enable MirageJS instead of the simple-fake-api server, edit src/main.tsx and uncomment the lines:
  //import { makeServer } from "../scripts/server.ts";
  //makeServer();
- On the package.json file, remove 'simple-fake-api' from the "start" command,
  then restart the app. By default, npm run start launches simple-fake-api alongside Vite.


## Table of Contents
- Features
- Project structure
- Scripts
- API and data layer
- Enabling MirageJS (mock server)
- Internationalization (i18n)
- Testing
- Development notes and configuration
- Troubleshooting


## Features
- Todos CRUD
  - List with server-side pagination (page, limit).
  - Create new todo (title, optional description, status).
  - Update status: Pending ⇄ Completed.
  - Edit title/description.
  - Delete a single todo.
- Responsive UI built with Chakra UI components.
- Accessible controls with aria-labels (including action buttons in the table).
- Translations for pt-BR, en and es for both app-level strings and feature-level (todos) strings.


## Project structure
Top-level directories and notable files
- api/ — API route handlers consumed by @marco-pontes/simple-fake-api
  - v1/todos/index.ts — GET /v1/todos and POST /v1/todos
  - v1/todos/_id.ts — PATCH /v1/todos/:id and DELETE /v1/todos/:id
- scripts/
  - server.ts — MirageJS alternative HTTP server with the same routes/behavior as api/
- src/
  - main.tsx — app bootstrap (TanStack Router, i18n init) and optional MirageJS hook
  - common/i18n.ts — i18next setup
  - assets/locales/ — app-wide locales (en.json, es.json, pt-BR.json)
  - features/todos/
    - assets/locales/ — todos feature locales (en.json, es.json, pt-BR.json)
    - components/table/menu/todos-menu.tsx — row actions (edit/complete/pending/delete)
    - components/table/body/todos-table-body.tsx — table body rendering with translations
    - types/todo.ts — Todo types and enums
- e2e/ — Playwright tests
  - home-complete-todo.spec.ts
  - home-pending-todo.spec.ts
  - home-edit-todo.spec.ts
  - home-delete-todo.spec.ts
  - create-form-validation-and-submit.spec.ts
- playwright.config.ts — Playwright configuration (webServer, baseURL, projects)
- vitest.setup.ts — Vitest setup
- vite.config.ts — Vite + plugins (tsconfig paths, static copy)
- simple-fake-api.config.ts — simple-fake-api configuration


## Scripts
Defined in package.json
- setup: npx playwright install && shx rm .husky/pre-commit
- start: concurrently 'vite' 'simple-fake-api'
  - Starts the front-end at http://127.0.0.1:5173
  - Starts the local API (simple-fake-api) at http://localhost:5000 (per simple-fake-api.config.ts)
- dev: vite (front-end only — useful if you enable MirageJS)
- api: simple-fake-api (API only)
- test: vitest run src/ && playwright test (run unit then e2e)
- test:unit: vitest src/
- test:unit:coverage: vitest --coverage src/
- test:e2e: playwright test
- test:e2e:report: playwright show-report
- lint / lint:fix: eslint
- format: prettier for src/**/*.{ts,tsx}


## API and data layer (@marco-pontes/simple-fake-api)
- The local API server is provided by @marco-pontes/simple-fake-api and reads handlers from the api/ folder.
- Configuration: simple-fake-api.config.ts
  - port: 5000
  - apiDir: "api"
  - wildcardChar: "_" (maps _id.ts to dynamic :id)
  - routeFileExtension: "ts"
- Implemented endpoints
  - GET /v1/todos
    - Query params: page (default 1), limit (default 10)
    - Returns an array of Todo entities (paginated)
    - Sets headers: X-Total-Count and Access-Control-Expose-Headers: X-Total-Count
    - Simulates latency via setTimeout (~2s)
  - POST /v1/todos
    - Body: { status: string, title: string, description?: string }
    - Validates non-empty status and title; returns 400 if invalid
    - Generates an id (10000–100000), echoes created todo
    - Simulates latency (~2s)
  - PATCH /v1/todos/:id
    - Body: { status: string, title?: string, description?: string }
    - Validates non-empty status; updates matching todo; 404 if not found
    - Returns the full todos array (simulates latency ~1s)
  - DELETE /v1/todos/:id
    - Removes a todo by id; returns full todos array; 404 if not found (simulates latency ~1s)


## Enabling MirageJS (mock server)
MirageJS server is provided at scripts/server.ts with the same endpoints/behavior.
- To enable MirageJS during development:
  1) Open src/main.tsx
  2) Uncomment the two lines:
     import { makeServer } from "../scripts/server.ts";
     makeServer();
  3) Start only the front-end (you can use npm run dev) or keep npm run start but note that two servers would run; typically use MirageJS instead of the simple-fake-api to avoid port conflicts.
- MirageJS server details
  - Seeds a single collection of 20 todos with ids 10001..10020
  - GET /v1/todos honors page and limit, sets X-Total-Count headers
  - POST /v1/todos validates status/title like the real API, generates id
  - PATCH /v1/todos/:id validates status, updates fields, returns full array
  - DELETE /v1/todos/:id removes and returns full array; 404 when not found


## Internationalization (i18n)
- i18next is initialized in src/common/i18n.ts.
- App-level locales: src/assets/locales/{pt-BR,en,es}.json
- Feature-level locales (Todos): src/features/todos/assets/locales/{pt-BR,en,es}.json
- The table and status labels resolve via keys like todos.enums.status.PENDING and COMPLETED; all locales share the same key structure for consistency.


## Testing
- Unit tests
  - Framework: Vitest + @testing-library/react + jest-dom
  - Run: npm run test:unit (or npm run test for all)
  - Coverage: npm run test:unit:coverage
- E2E tests
  - Framework: Playwright
  - Run: npm run test:e2e
  - Report: npm run test:e2e:report (opens the HTML report)
  - Configuration: playwright.config.ts
    - Starts the dev server automatically (npm -s start) at http://127.0.0.1:5173
    - Projects: Chromium, Firefox, WebKit
  - Notable specs
    - e2e/home-complete-todo.spec.ts — toggles to Completed and asserts success toast
    - e2e/home-pending-todo.spec.ts — toggles to Pending
    - e2e/home-edit-todo.spec.ts — edits a todo
    - e2e/home-delete-todo.spec.ts — deletes a todo
    - e2e/create-form-validation-and-submit.spec.ts — validates form and creates a todo


## Development notes and configuration
- UI stack
  - Chakra UI components (Buttons, Table, Checkbox, Layout)
  - TanStack Router for routing, with routeTree.gen.ts and devtools
  - TanStack Query for data fetching/caching (and devtools)
  - TanStack Table for the grid rendering
- Code quality
  - ESLint 9, Prettier 3, TypeScript strict tooling via typescript-eslint
  - Commit hooks via Husky, Commitizen and commitlint enforcing Conventional Commits
- Build tooling
  - Vite 7 with @vitejs/plugin-react-swc, vite-tsconfig-paths
- Paths and aliases
  - @/ maps to src/ (configured via vite-tsconfig-paths and tsconfig paths)


## Running locally
- Default dev server: http://127.0.0.1:5173
- Default API server (simple-fake-api): http://localhost:5000
- Start both with: npm run start
- If you prefer MirageJS instead of the API process:
  - Uncomment makeServer() and its import in src/main.tsx
  - Run npm run dev (front-end only) to avoid starting simple-fake-api


## Troubleshooting
- Playwright browsers not found: run npm run setup (or npx playwright install)
- Port 5000 already in use: stop any process on 5000 or switch to MirageJS (see above)
- E2E tests flaky due to timing: both API and MirageJS simulate latency; Playwright specs already wait for table to render first checkbox. If customizing, ensure awaiting UI readiness.
- Missing translations: ensure keys exist in both src/assets/locales and feature locales under src/features/todos/assets/locales.


## License
MIT
