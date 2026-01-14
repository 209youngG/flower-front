import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, NetworkOnly } from "workbox-strategies";
import { ExpirationPlugin } from 'workbox-expiration';

// Workbox 에 의해 빌드 시 자동으로 삽입될 파일 목록
precacheAndRoute(self.__WB_MANIFEST);

// /api/ 요청, index.html: 네트워크 우선 처리
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/') || url.pathname === '/' || url.pathname.endsWith('index.html'),
  new NetworkOnly()
);

// 이미지 요청: 캐시 우선 처리 및 만료 정책 설정
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50, // 최대 50개 항목 캐싱
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7일 동안 유지
      }),
    ],
  })
);

// 서비스 워커 설치 후 즉시 활성화
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 서비스 워커 활성화
self.addEventListener('activate', (event) => {
  // 추가적인 로직이 필요하지 않음 (Workbox가 자동 관리)
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting(); // 현재 대기 중인 서비스 워커를 활성화
  }
});
