# flower-front Agentic Coding Protocol

**Updated:** 2026-01-26
**Framework:** Vue 3 (Composition API) + Quasar + Vite
**State Strategy:** Server (Vue Query) + Client (Pinia) + Local (Ref/Reactive)
**Platform:** Mobile-First PWA + Admin Dashboard + Native Bridge

## WORKFLOW STANDARD (MANDATORY) 🌟

**"Think before you code. Document before you execute."**

For any task involving "Strategy", "Planning", "Refactoring" or "Complex Features":

1. **Analyze & Plan:**
   - Analyze the codebase context first.
   - Propose a strategy to the user.

2. **Document (The Check-File):**
   - BEFORE writing any code, create or update **`ROADMAP.md`** (or `TASKS.md`).
   - Break down the strategy into specific, actionable items with checkboxes `[ ]`.

3. **Execute & Update:**
   - Implement features step-by-step.
   - Mark items as `[x]` in `ROADMAP.md` immediately after completion.
   - **Do not proceed** to the next step until the current one is marked done.
   - If the plan changes, update the document first.

## COMMANDS

- **Dev:** `npm run dev` (Starts at http://localhost:9000)
- **Build:** `npm run build` (Builds PWA to `dist/spa`)
- **Lint:** `npm run lint` (ESLint)
- **Format:** `npm run format` (Prettier)
- **Test:** `npm test` (Vitest)
  - **Run Single Test:** `npx vitest run path/to/file.spec.ts` or `npm test -- -t "Test Name Pattern"`

## OVERVIEW

This is a Hybrid PWA for a Flower Shop, consisting of two main parts:

1.  **User App (Mobile):** Focus on speed, optimistic updates, and native-like experience (Camera, Push).
2.  **Admin Dashboard (Desktop):** Focus on data integrity, grids, and bulk actions.

The app uses a **Native Bridge (`wnInterface`)** to communicate with iOS/Android shells.

## TECH STACK

- **Core:** Vue 3 (Composition API), Quasar v2, Vite v4, TypeScript
- **State Management:**
  - **Server State:** `@tanstack/vue-query` (Primary for data)
  - **Client State:** `pinia` (Auth, Theme, Metadata)
- **Validation:** `zod` (Runtime Schema Validation)
- **Native:** Custom Bridge (`src/common/native-bridge.ts`)

## ARCHITECTURE & PATTERNS

### Directory Structure

```
src/
├── api/             # API Wrappers (Pure Async, Zod Typed)
├── boot/            # Init Scripts (Axios, Vue Query, Push)
├── common/          # Native Bridge Implementation
├── components/      # Shared Dumb Components
├── layouts/         # App Shells (Main, Admin)
├── pages/           # Smart Components (Grouped by Domain)
│   ├── admin/       # Back-office
│   ├── product/     # Shopping (User)
│   └── review/      # Feature specific
├── stores/          # Global Client State (System, User)
└── utils/           # Shared Helpers (Idempotency, Formatters)
```

### State Management Rules

1.  **Server Data:** ALWAYS use `useQuery` / `useMutation`.
    - Do not store API responses in Pinia unless they are static metadata (like System Codes).
    - Use `useInfiniteQuery` for lists (User App).
    - Use `useQuery` with `keepPreviousData` for grids (Admin).
2.  **Client Data:** Use Pinia for Auth, Toast, Modal State.
3.  **Hybrid Pattern:** Sync Server State to Local `ref` via `watch` if local mutation is needed (e.g., UI counters).

### Backend Integration
- **Proxy Config:** Check `vite.config.ts`. Requests to `/api` are proxied to the backend (default: `http://localhost:8080`).
- **Auth:** JWT tokens are automatically handled by `src/boot/axios.js` interceptors.

## CODING STANDARDS

### Imports

- Use absolute paths with aliases:
  - `src/api/*`
  - `stores/*`
  - `components/*`
  - `boot/*`

### Types & Validation

- **Strict TypeScript:** No `any`.
- **Zod First:** Define Zod schemas for all API responses and Forms.
  - Export inferred types: `export type User = z.infer<typeof UserSchema>`
- **Props:** Use `defineProps<{ id: number }>()` syntax.

### Naming Conventions

- **Files:** PascalCase for Components (`ProductList.vue`), kebab-case for TS/JS (`native-bridge.ts`).
- **Composables:** `use{Feature}` (e.g., `useCart`).
- **API:** `get{Resource}`, `create{Resource}`, `update{Resource}`.

### Error Handling

- **API:** Throw errors in `src/api`.
- **UI:** Catch in Components/Composables and show `Notify.create` (Toast) or redirect.
- **Payment:** Provide "Retry" UI for critical failures.

## ANTI-PATTERNS

- ❌ **Storing Server Data in Pinia:** Leads to stale data. Use Vue Query cache.
- ❌ **Hardcoded Enums:** Use `SystemStore` to fetch codes from backend.
- ❌ **Direct Axios Calls:** Always go through `src/api` layer.
- ❌ **Console Logs:** Remove before commit (Strict Linting).
