# API Module Guide

**Updated:** 2026-01-22
**Role:** Data Fetching Layer
**Stack:** Axios + TypeScript + Zod (Validation)

## OVERVIEW

Pure async functions for backend communication.
Designed to be used as `queryFn` in **TanStack Query** or direct calls in Pinia Actions.

## STRATEGY

1. **Zod Validation:** Validate API responses at runtime using Zod schemas.
2. **Type Safety:** 100% TypeScript with strict interfaces/DTOs (NO `any`).
3. **No Side Effects:** Functions must be pure promises. Do not trigger routing or UI alerts here.

## STRUCTURE

- **Pattern:** `export const fetchUser = async (id: string): Promise<User> => { ... }`
- **Instance:** Use `api` from `boot/axios` (Interceptors configured).

## CONVENTIONS

- **Return Types:** ALWAYS return parsed data or typed responses.
- **Naming:**
  - `fetch{Resource}` (GET list/single)
  - `create{Resource}` (POST)
  - `update{Resource}` (PUT/PATCH)
  - `delete{Resource}` (DELETE)
- **Error Handling:** Throw raw errors. Let **Vue Query** (`onError`) or **Global Error Boundary** handle the UI feedback.

## MIGRATION (Legacy to Modern)

- [ ] **Remove `any`**: Replace with explicit interfaces or `z.infer<typeof Schema>`.
- [ ] **Decouple Logic**: Remove any `router.push` or `Notify.create` from API files.
- [ ] **Add Validation**: Wrap response data with `Schema.parse(response.data)` for critical paths.
