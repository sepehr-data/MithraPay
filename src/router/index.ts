import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AdminDashboard from '@/pages/admin/AdminDashboard.vue'
import AdminProducts from '@/pages/admin/AdminProducts.vue'
import AdminProductForm from '@/pages/admin/AdminProductForm.vue'
import AdminBanners from '@/pages/admin/AdminBanners.vue'
import AdminUsers from '@/pages/admin/AdminUsers.vue'
import AdminOrders from '@/pages/admin/AdminOrders.vue'

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
  { path: '/search', name: 'search', component: () => import('@/pages/SearchPage.vue') },
  { path: '/auth/login', name: 'login', component: () => import('@/pages/LoginPage.vue'), meta: { auth: true }},
  { path: '/auth/register', name: 'register', component: () => import('@/pages/RegisterPage.vue'), meta: { auth: true }},
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', component: AdminDashboard },
      { path: 'products', component: AdminProducts },
      { path: 'products/new', component: AdminProductForm },
      { path: 'products/:id', component: AdminProductForm },
      { path: 'banners', component: AdminBanners },
      { path: 'users', component: AdminUsers },
      { path: 'orders', component: AdminOrders },

      { path: 'blogs', component: () => import('@/pages/admin/AdminBlogs.vue') },
      { path: 'blogs/new', component: () => import('@/pages/admin/AdminBlogForm.vue') },
      { path: 'blogs/:id', component: () => import('@/pages/admin/AdminBlogForm.vue') },
    ],
  },
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
