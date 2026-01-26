# 📊 Flower Shop Frontend Roadmap

**Last Updated:** 2026-01-22
**Status:** Strategy 1, 2, 3 Complete (Ready for Production Review)

## 1. 현황 분석 (As-Is)

- **Architecture:** Vue 3 + Quasar + Vite (Modular)
- **State:** Vue Query (Server) + Pinia (Client)
- **Validation:** Zod Integration
- **Platform:** Mobile PWA + Admin Dashboard + Native Bridge

## 2. 완료된 전략 (Executed Strategies)

### 🔴 Strategy 1: 메타데이터 동적 관리 (Dynamic Metadata) - **DONE**

- [x] **API:** `src/api/system.ts` (공통 코드 조회)
- [x] **Store:** `src/stores/system-store.ts` (메타데이터 캐싱)
- [x] **Refactor:** `ProductManagementPage.vue` (하드코딩 제거)
- [x] **Refactor:** `ProductListPage.vue` (필터 동적 생성)

### 🟡 Strategy 2: 결제 프로세스 안정화 (Payment Resilience) - **DONE**

- [x] **Feature:** Idempotency Key 생성 로직 (`src/api/order.ts`)
- [x] **Feature:** 결제 실패/취소 시 복구 UI (`PaymentDialog.vue`)
- [x] **Test:** 결제 흐름 e2e 테스트 (`e2e/payment.spec.ts`)

### 🟢 Strategy 3: 하이브리드 기능 확장 (Native Enhancement) - **DONE**

- [x] **Bridge:** `src/common/native-bridge.ts` 리팩토링 및 확장 (Camera, Push)
- [x] **Feature:** 리뷰 작성 페이지(`ReviewWritePage.vue`)에 카메라 연동
- [x] **Feature:** 앱 실행 시 Push Token 동기화 (`boot/push-notification.ts`)

## 3. 향후 계획 (Next Steps)

- [ ] **CI/CD:** GitHub Actions 워크플로우 구축
- [ ] **Release:** 프로덕션 배포 및 앱 스토어 심사 준비
