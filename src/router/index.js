import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useUserStore } from "stores/user-store";
import { Notify } from "quasar";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    // Admin Guard
    if (to.path.startsWith('/admin')) {
      const userStore = useUserStore()
      if (!userStore.isAuthenticated) {
        Notify.create({ type: 'warning', message: '로그인이 필요합니다.' })
        next('/auth/login')
        return
      }
      if (userStore.user.role !== 'ADMIN') {
        Notify.create({ type: 'negative', message: '관리자 권한이 없습니다.' })
        next('/')
        return
      }
    }

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        // 강제로 네트워크 요청 발생
        const url = `${window.location.origin}${to.fullPath}`;
        const response = await fetch(url, { method: 'GET' });

        if (response.ok) {
          // console.info('Service Worker에서 요청 성공');
        } else {
          console.warn('Service Worker 요청 실패');
        }
      } catch (error) {
        console.error('Service Worker 요청 중 오류 발생:', error);
      }
    }
    next();
  });

  Router.afterEach((to, from) => {
    // 페이지 전환 후에 실행되는 코드

    if (document.getElementsByTagName("h3").length > 0 && to.meta && to.meta.title) {
      setTimeout(() => {
        document.getElementsByTagName("h3")[0].innerHTML = to.meta.title;
      }, 100);
    }
  });

  return Router;
});
