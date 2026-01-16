const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/product/ProductListPage.vue') },
      { path: 'cart', component: () => import('pages/cart/CartPage.vue'), meta: { requiresAuth: true } },
      { path: 'auth/login', component: () => import('pages/auth/LoginPage.vue') },
      { path: 'auth/register', component: () => import('pages/auth/RegisterPage.vue') },
      { path: 'my-orders', component: () => import('pages/member/MyOrderPage.vue'), meta: { requiresAuth: true } },
      { path: 'my-orders/:id', component: () => import('pages/member/OrderDetailPage.vue'), meta: { requiresAuth: true } }
    ]
  },

  {
    path: '/admin/login',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      { path: '', component: () => import('pages/auth/AdminLoginPage.vue') }
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', component: () => import('pages/admin/DashboardPage.vue') },
      { path: 'products', component: () => import('pages/admin/ProductManagementPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
