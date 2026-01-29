# TDD Guidelines - flower-front (Vue 3 + Quasar)

**Last Updated:** 2026-01-29  
**Purpose:** Enforce Test-Driven Development for frontend components

---

## 🔴 Red-Green-Refactor 원칙

모든 컴포넌트/로직은 **반드시 실패하는 테스트 먼저 작성** 후 구현합니다.

```
🔴 RED    → 실패하는 테스트 작성
🟢 GREEN  → 테스트를 통과하는 최소 코드 작성
🔵 REFACTOR → 코드 개선 (테스트는 계속 Green 유지)
```

---

## 📋 TDD Workflow

### 1️⃣ RED: 실패하는 테스트 작성

**예시: SizeGuideModal 컴포넌트**

```typescript
// src/components/__tests__/SizeGuideModal.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SizeGuideModal from '../SizeGuideModal.vue'

describe('SizeGuideModal', () => {
  it('should display all four sizes (S, M, L, XL)', () => {
    const wrapper = mount(SizeGuideModal, {
      props: { modelValue: true },
      global: { stubs: { 'q-dialog': true, 'q-card': true } }
    })

    expect(wrapper.text()).toContain('Small')
    expect(wrapper.text()).toContain('Medium')
    expect(wrapper.text()).toContain('Large')
    expect(wrapper.text()).toContain('Extra Large')
  })
})
```

**실행 결과:**
```bash
npm test
# ❌ Cannot find module '../SizeGuideModal.vue'
```

---

### 2️⃣ GREEN: 최소한의 구현

```vue
<!-- src/components/SizeGuideModal.vue -->
<script setup lang="ts">
defineProps<{ modelValue: boolean }>()

const sizes = [
  { code: 'S', name: 'Small' },
  { code: 'M', name: 'Medium' },
  { code: 'L', name: 'Large' },
  { code: 'XL', name: 'Extra Large' }
]
</script>

<template>
  <q-dialog :model-value="modelValue">
    <q-card>
      <div v-for="size in sizes" :key="size.code">
        {{ size.name }}
      </div>
    </q-card>
  </q-dialog>
</template>
```

**실행 결과:**
```bash
npm test
# ✅ Test passed
```

---

### 3️⃣ REFACTOR: 코드 개선

```vue
<script setup lang="ts">
import { computed } from 'vue'

interface SizeInfo {
  code: string
  name: string
  height: string
  flowerCount: string
  recommendation: string
}

const sizes = computed<SizeInfo[]>(() => [
  { 
    code: 'S', 
    name: 'Small', 
    height: '30-40cm',
    flowerCount: '10-15송이',
    recommendation: '1인 선물용'
  },
  // ...
])
</script>
```

---

## 🧪 테스트 종류별 가이드

### 1. Component Tests (컴포넌트 테스트)

**도구:** Vitest + @vue/test-utils

```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

describe('StoreCard', () => {
  it('should emit click event when card is clicked', async () => {
    const wrapper = mount(StoreCard, {
      props: { store: { id: 1, name: 'Test Shop' } }
    })

    await wrapper.find('.store-card').trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('click')
    expect(wrapper.emitted('click')?.[0]).toEqual([1])
  })
})
```

---

### 2. Composables Tests (컴포저블 테스트)

**대상:** `useCart`, `useAuth` 등

```typescript
// src/composables/__tests__/useCart.spec.ts
import { describe, it, expect } from 'vitest'
import { useCart } from '../useCart'

describe('useCart', () => {
  it('should add item to cart', () => {
    const { cart, addToCart } = useCart()
    
    addToCart({ productId: 1, quantity: 2 })
    
    expect(cart.value).toHaveLength(1)
    expect(cart.value[0].quantity).toBe(2)
  })

  it('should increase quantity if item already exists', () => {
    const { cart, addToCart } = useCart()
    
    addToCart({ productId: 1, quantity: 2 })
    addToCart({ productId: 1, quantity: 3 })
    
    expect(cart.value).toHaveLength(1)
    expect(cart.value[0].quantity).toBe(5)
  })
})
```

---

### 3. API Schema Tests (Zod 스키마 테스트)

**대상:** `src/api/*.ts` 스키마

```typescript
// src/api/__tests__/store.spec.ts
import { describe, it, expect } from 'vitest'
import { StoreSchema } from '../store'

describe('StoreSchema', () => {
  it('should validate correct store data', () => {
    const validStore = {
      id: 1,
      name: 'Flower Shop',
      address: 'Seoul',
      lat: 37.5,
      lon: 127.0
    }

    const result = StoreSchema.safeParse(validStore)
    expect(result.success).toBe(true)
  })

  it('should reject invalid coordinates', () => {
    const invalidStore = {
      id: 1,
      name: 'Shop',
      address: 'Seoul',
      lat: 'invalid', // ❌ should be number
      lon: 127.0
    }

    const result = StoreSchema.safeParse(invalidStore)
    expect(result.success).toBe(false)
  })
})
```

---

### 4. Pinia Store Tests (상태 관리 테스트)

```typescript
// src/stores/__tests__/cart-store.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../cart-store'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should add product to cart', () => {
    const store = useCartStore()
    
    store.addToCart({ id: 1, name: 'Rose', price: 10000, quantity: 1 })
    
    expect(store.items).toHaveLength(1)
    expect(store.totalPrice).toBe(10000)
  })
})
```

---

## 🎯 Quasar 컴포넌트 Stub 전략

Quasar 컴포넌트는 테스트에서 Stub 처리:

```typescript
const wrapper = mount(MyComponent, {
  global: {
    stubs: {
      'q-dialog': { template: '<div><slot /></div>' },
      'q-card': { template: '<div><slot /></div>' },
      'q-btn': { template: '<button @click="$attrs.onClick"><slot /></button>' },
      'q-input': true,
      'q-select': true
    }
  }
})
```

---

## 📏 커버리지 목표

- **Components**: 주요 상호작용 로직 테스트
- **Composables**: 100% 커버리지 (비즈니스 로직)
- **API Schemas**: 모든 Zod 스키마 검증
- **Stores**: 모든 액션 테스트

---

## 🚫 TDD 위반 사례

### ❌ 나쁜 예시 (Test-Last)

```vue
<!-- 1. 먼저 컴포넌트 작성 -->
<script setup lang="ts">
const handleSubmit = () => {
  // 복잡한 로직 구현 완료
}
</script>

<!-- 2. 나중에 테스트 추가 -->
```

### ✅ 좋은 예시 (Test-First)

```typescript
// 1. 먼저 실패하는 테스트 작성
it('should validate form before submit', () => {
  const wrapper = mount(StoreRegisterForm)
  
  wrapper.find('button[type="submit"]').trigger('click')
  
  expect(wrapper.text()).toContain('필수 항목을 입력해주세요')
})

// 2. 테스트를 통과시키기 위해 구현
const handleSubmit = () => {
  if (!form.value.name) {
    error.value = '필수 항목을 입력해주세요'
    return
  }
  // ...
}
```

---

## 🛠️ TDD 명령어

### 테스트 실행
```bash
# 전체 테스트
npm test

# Watch 모드 (개발 중)
npm test -- --watch

# 특정 파일만
npm test -- SizeGuideModal.spec.ts

# 커버리지 리포트
npm test -- --coverage
```

### UI 모드 (추천)
```bash
npx vitest --ui
# http://localhost:51204/__vitest__/ 에서 확인
```

---

## 📚 참고 자료

- [AGENTS.md - Frontend Patterns](./AGENTS.md)
- Vitest: https://vitest.dev/
- Vue Test Utils: https://test-utils.vuejs.org/
- Zod: https://zod.dev/

---

## ✅ Phase 2부터 적용

앞으로 모든 새로운 기능은:
1. 🔴 테스트 먼저 (Red)
2. 🟢 구현 (Green)
3. 🔵 리팩토링 (Refactor)

**테스트 없는 컴포넌트는 PR 불가!**
