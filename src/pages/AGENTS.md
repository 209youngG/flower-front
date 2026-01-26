# Pages Module Guide

**Updated:** 2026-01-22
**Layer:** View / Controller
**Pattern:** Smart Components (Pages) vs Dumb Components

## OVERVIEW

Pages act as the "Controller" in our architecture. They orchestrate data fetching, user interaction, and layout structure.
Grouped by domain (auth, product, admin) matching the backend modules.

## STRUCTURE

```
pages/
├── admin/       # Back-office (Dashboard, Product Mgmt)
├── auth/        # Login, Register (Public)
├── member/      # User Profile, Order History
├── product/     # Shop Main, Details
└── cart/        # Shopping Cart
```

## CONVENTIONS

### 1. Script Setup & TypeScript

- **MUST** use `<script setup lang="ts">`.
- Props/Emits must be typed: `defineProps<{ id: string }>()`.

### 2. State Management Strategy

- **Server Data:** Use **Vue Query (`useQuery`)**.
  - NEVER store server data in Pinia unless it's needed globally and synchronously.
  - Pattern: `const { data, isLoading } = useQuery(...)`
- **UI State:** Use `ref` / `reactive` for local state (e.g., dialog open, form inputs).
- **Global UI State:** Use **Pinia** (e.g., Auth User, Theme, Toast).

### 3. Hybrid State Pattern (Important)

When you need to modify server data locally (e.g., quantity counter in a list):

1. Fetch data with `useQuery`.
2. Sync to local `ref` using `watch` with `{ immediate: true }`.
3. UI binds to local `ref`.

```typescript
const { data } = useQuery(...)
const products = ref<ProductUI[]>([])

watch(data, (serverData) => {
  if (serverData) products.value = serverData.map(p => ({ ...p, uiQuantity: 1 }))
}, { immediate: true })
```

## ANTI-PATTERNS

- **No direct API calls**: Import functions from `@/api`.
- **No heavy logic**: Move complex business logic to `composables/use{Feature}.ts`.
- **No global styles**: Use scoped SCSS or Quasar utility classes (`q-pa-md`, `text-primary`).
