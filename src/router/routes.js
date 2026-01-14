const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/product/ProductListPage.vue') },
      { path: 'cart', component: () => import('pages/cart/CartPage.vue') },
      { path: 'auth/login', component: () => import('pages/auth/LoginPage.vue') },
      { path: 'auth/register', component: () => import('pages/auth/RegisterPage.vue') }
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
