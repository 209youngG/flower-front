/* global naver, wnInterface */
import { boot } from "quasar/wrappers";
import { loadScript } from "vue-plugin-load-script";

// import VueGtag from "vue-gtag";

export default boot(({ app: _app }) => {
  loadScript(import.meta.env.VITE_NAVER_MAP_URL)
    .then(async (_res) => {
      // console.log("load script success... ");
      if (typeof naver !== 'undefined') {
        naver.maps.onJSContentLoaded = () => {
          // console.log("onJSContentLoaded success... ");
        };
      }
    })
    .catch((_err) => {
      // console.log("load script fail ... ");
    });

  if (!window?.wnInterface) {
    //안드로이드인 경우 wnInterface객체가 이미 webview에 있기 때문에
    //아이폰 과 크롬용 wnInterface.js만 로딩한다.
    const userAgent = navigator.userAgent.toLowerCase();
    if (
      userAgent.indexOf("iphone") > -1 ||
      userAgent.indexOf("ipad") > -1 ||
      userAgent.indexOf("ipod") > -1
    ) {
      import("src/common/wnInterface-ios");
    } else {
      import("src/common/wnInterface-pc");
    }
    // app.use(VueGtag, {
    //   config: {
    //     id: "G-6HKZY9N4NN",
    //     pageTrackerScreenviewEnabled: true,
    //   },
    // });
  }

  // [수정] 서비스 워커 수동 등록 로직 주석 처리
  // 이유: Quasar는 PWA 모드에서 src-pwa/register-service-worker.js를 통해 자동으로 서비스 워커를 관리합니다.
  // 이곳에서 수동으로 등록하면 SPA 모드(개발 환경)에서 404 에러가 발생하며, PWA 모드에서는 로직이 중복됩니다.
  /*
  // 서비스 워커 등록
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {

      // 새로운 서비스 워커가 대기 중일 때 처리
      if (registration.waiting) {
        handleWaitingServiceWorker(registration);
      }

      // 새로운 서비스 워커가 발견되었을 때 처리
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            handleWaitingServiceWorker(registration);
          }
        };
      };
    }).catch((error) => {
      console.error('서비스 워커 등록 중 오류:', error);
    });

    // 주기적으로 서비스 워커 갱신 확인 (예: 1시간마다)
    setInterval(() => {
      checkForServiceWorkerUpdate();
    }, 60 * 1000); // 1분마다 확인
  }
  */
});

/*
// 새로운 서비스 워커 활성화 핸들러
function handleWaitingServiceWorker(registration) {
  registration.waiting.postMessage({ type: 'SKIP_WAITING' });

  registration.waiting.addEventListener('statechange', (event) => {
    if (event.target.state === 'activated') {
      if (typeof wnInterface !== 'undefined') {
        wnInterface.reload(); // 페이지 새로고침
      } else {
        window.location.reload();
      }
    }
  });
}

// 서비스 워커 갱신 확인 함수
function checkForServiceWorkerUpdate() {
  navigator.serviceWorker.getRegistration().then((registration) => {
    if (registration) {
      registration.update().then(() => {
      });
    }
  }).catch((error) => {
    console.error('서비스 워커 갱신 확인 중 오류:', error);
  });
}
*/

