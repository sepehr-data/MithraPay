import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
  { path: '/category/:slug', name: 'category', component: () => import('@/pages/CategoryPage.vue') },
  { path: '/product/:slug', name: 'product', component: () => import('@/pages/ProductPage.vue') },
  { path: '/cart', name: 'cart', component: () => import('@/pages/CartPage.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('@/pages/CheckoutPage.vue') },
  { path: '/blog', name: 'blog', component: () => import('@/pages/BlogList.vue') },
  { path: '/blog/:slug', name: 'post', component: () => import('@/pages/BlogPost.vue') },
  { path: '/support', name: 'support', component: () => import('@/pages/SupportPage.vue') },
  { path: '/about', name: 'about', component: () => import('@/pages/AboutPage.vue') },
  { path: '/profile', name: 'profile', component: () => import('@/pages/ProfilePage.vue') },
  { path: '/login', name: 'login', component: () => import('@/pages/LoginPage.vue') },
  { path: '/search', name: 'search', component: () => import('@/pages/SearchPage.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
