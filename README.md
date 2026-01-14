# Flower Shop Frontend (Mobile Web)

Flower Shop 백엔드와 연동되는 모바일 최적화 웹 애플리케이션입니다.
백엔드의 모듈러 구조와 일치하는 **도메인 주도 모듈형 아키텍처(Domain-Driven Modular Architecture)**를 채택하여 유지보수성을 높였습니다.

## 🛠 기술 스택

| 구분 | 기술 | 설명 |
| :--- | :--- | :--- |
| **Framework** | **Vue 3** | Composition API 사용 |
| **Build Tool** | **Vite** | 초고속 빌드 및 개발 서버 |
| **UI Framework** | **Quasar** | Material Design 기반 반응형 UI |
| **State Mgmt** | **Pinia** | 직관적인 전역 상태 관리 |
| **HTTP Client** | **Axios** | API 통신 (JWT Interceptors 적용) |

## 🏗 프로젝트 구조 (Modular Architecture)

기능(Feature) 단위로 코드를 응집시켜 백엔드 모듈 구조와 싱크를 맞췄습니다.

```
src/
├── api/                 # 백엔드 API 호출 모듈 (auth, product, cart, order)
├── boot/                # 앱 초기화 스크립트 (axios interceptor 등)
├── layouts/             # 레이아웃 (MainLayout, AdminLayout)
├── pages/               # 페이지 컴포넌트
│   ├── auth/            # 로그인, 회원가입
│   ├── product/         # 상품 목록
│   ├── cart/            # 장바구니
│   └── admin/           # 관리자 페이지 (대시보드, 상품 관리)
├── router/              # 라우팅 설정 (Navigation Guard 포함)
└── stores/              # Pinia 스토어 (user-store, cart-store)
```

## 🚀 실행 방법

### 요구 사항
- Node.js 18+
- npm 또는 yarn/pnpm

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```
브라우저에서 `http://localhost:9000`으로 접속합니다. (Quasar 기본 포트)

### 백엔드 연동
`vite.config.ts`에 프록시 설정이 되어 있어, 로컬에서 실행 중인 백엔드 서버(`http://localhost:8080`)와 자동으로 연결됩니다.
API 요청은 `/api` prefix를 통해 전달됩니다.

## 📱 주요 기능
- **인증 (Auth)**: JWT 기반 로그인, 회원가입, 자동 로그아웃 (401 처리).
- **쇼핑몰 (User)**:
    - **홈 화면**: 상품 목록 조회, 재고 확인, 장바구니 담기.
    - **장바구니**: 상품 확인, 수량 조절, 주문하기.
- **관리자 (Admin)**:
    - `/admin` 경로 접근 시 권한 체크.
    - **대시보드**: 상품 현황 조회.
    - **상품 관리**: 상품 등록, 수정, 삭제 기능.
