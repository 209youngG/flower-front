# Flori Development Roadmap 🌸

**Goal:** 누구나 쉬운 꽃 선물 플랫폼, '플로리(Flori)' Frontend 구축
**Platform:** Mobile PWA (Customer) + Admin Dashboard (Partner)

---

## Phase 0: Project Restructuring 🏗️
- [x] **Mode Separation**
  - [x] Customer Mode (일반 사용자용 UI)
  - [x] Partner Mode (사장님용 대시보드 - `/partner` 라우트 분리)
- [x] **Theme Setup**
  - [x] Vibe 4 Color Palette 정의 (Lovely, Vivid, Chic, Natural)

## Phase 1: O2O Platform Base 🏪
**목표:** 위치 기반 꽃집 탐색 및 사장님 가게 관리

### 1.1 Store Feature
- [ ] **Onboarding**: 사장님 회원가입 및 가게 정보 등록 폼 (주소 검색 연동)
- [ ] **Store Locator**: 내 위치(GPS) 기반 꽃집 리스트 및 지도 뷰
- [ ] **Store Detail**: 가게 포트폴리오, 리뷰, 판매 상품 목록 페이지

### 1.2 Product & Order
- [ ] 상품 리스트 필터: '내 주변', '픽업 가능', '당일 배송'
- [ ] 상세 페이지: 사이즈(S/M/L/XL) 가이드 모달 및 비교 UI
- [ ] 장바구니/주문: 픽업/배송 시간 선택 UI 고도화

## Phase 2: Flori Sommelier (AI Curation) 🍷
**목표:** 대화하듯 편안한 꽃 추천 경험 (Chat-like UI)

### 2.1 Sommelier Wizard
- [ ] **Step UI**: 대상(Who) -> 상황(Why) -> 분위기(Vibe, 컬러피커) -> 예산(Budget)
- [ ] **Result Page**:
  - Best Seller (실패 없는 선택)
  - Storytelling (꽃말 카드 UI)
  - Smart Choice (가성비)
- [ ] **AI Message**: 주문서 작성 시 'AI 문구 생성' 버튼 및 선택 칩(Chip) UI

## Phase 3: Trust & Profit 🤝
**목표:** 안심 프리뷰 및 타임세일

### 3.1 Trust Preview (User)
- [ ] 주문 내역: '제작 사진 확인하기' 버튼 (상태가 `PREVIEW_SENT`일 때)
- [ ] 프리뷰 팝업: 이미지 확대 보기 및 '확인/수정요청' 기능

### 3.2 Trust Preview (Partner)
- [ ] 주문 접수 상세: '카메라' 아이콘 -> 사진 촬영/업로드 -> '전송'
- [ ] Push 알림 연동 테스트

### 3.3 오늘의 꽃
- [ ] **Home**: 메인 상단 '마감 임박! 오늘의 꽃' 가로 스크롤 섹션
- [ ] **Partner**: '1분 만에 타임세일 등록' 간편 폼

## Phase 4: Visual & Interaction 🚀
- [ ] **Visual Search**: 검색창 카메라 버튼 -> 이미지 업로드 -> 결과 뷰
- [ ] **Review Challenge**: Before(프리뷰) vs After(실물) 비교 리뷰 UI
- [ ] **Interaction**: 꽃말 카드 공유하기, 선물하기(링크 전송) 기능

---
**Note:** Mobile First 디자인을 최우선으로 하며, Quasar의 반응형 기능을 적극 활용합니다.
