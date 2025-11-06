<template>
  <div class="min-h-screen flex bg-base-200">
    <!-- sidebar -->
    <aside class="w-60 bg-base-100 border-l border-base-300 hidden md:flex flex-col">
      <div class="h-16 flex items-center justify-center border-b border-base-200">
        <span class="font-bold text-primary">پنل مدیریت</span>
      </div>
      <nav class="flex-1 px-3 py-4 space-y-1 text-right">
        <RouterLink
            v-for="item in menu"
            :key="item.to"
            :to="item.to"
            class="flex justify-between items-center px-3 py-2 rounded-lg hover:bg-base-200"
            :class="isActive(item.to) ? 'bg-base-200 font-semibold' : ''"
        >
          <span>{{ item.label }}</span>
          <span class="text-base-content/40 text-xs" v-if="item.badge">{{ item.badge }}</span>
        </RouterLink>
      </nav>
      <div class="p-3 text-xs text-base-content/50 text-center border-t border-base-200">
        نسخه آزمایشی
      </div>
    </aside>

    <!-- main -->
    <div class="flex-1 flex flex-col">
      <!-- top bar -->
      <header class="h-16 bg-base-100 border-b border-base-300 flex items-center justify-between px-4">
        <div class="flex items-center gap-2">
          <button class="btn btn-ghost btn-sm md:hidden" @click="showSide = !showSide">☰</button>
          <h1 class="font-bold text-base-content/80">MithraPay Admin</h1>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs text-base-content/60">ادمین</span>
          <RouterLink to="/" class="btn btn-sm btn-outline">رفتن به سایت</RouterLink>
        </div>
      </header>

      <!-- mobile drawer -->
      <div
          v-if="showSide"
          class="fixed inset-0 bg-black/40 z-40 md:hidden"
          @click="showSide = false"
      >
        <div class="absolute right-0 top-0 bottom-0 w-56 bg-base-100 shadow-xl p-4 space-y-2">
          <p class="font-bold mb-4">منو</p>
          <RouterLink
              v-for="item in menu"
              :key="item.to"
              :to="item.to"
              class="block py-2"
              @click="showSide = false"
          >
            {{ item.label }}
          </RouterLink>
        </div>
      </div>

      <!-- router outlet -->
      <main class="p-4 lg:p-6 flex-1">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showSide = ref(false)

const menu = [
  { label: 'داشبورد', to: '/admin' },
  { label: 'محصولات', to: '/admin/products' },
  { label: 'بنرها', to: '/admin/banners' },
  { label: 'سفارش‌ها', to: '/admin/orders' },
  { label: 'کاربران', to: '/admin/users' },
  { label: 'بلاگ', to: '/admin/blogs' },
]

const isActive = (path: string) => route.path === path
</script>
