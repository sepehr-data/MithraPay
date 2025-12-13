<template>
  <div
      class="min-h-screen bg-gradient-to-br from-base-200 via-base-200 to-base-300 flex"
      dir="rtl"
  >
    <!-- sidebar (desktop) -->
    <aside
        class="hidden md:flex w-72 xl:w-80 m-3 ml-0 rounded-3xl bg-base-100/95 border border-base-300 shadow-xl flex-col"
    >
      <!-- admin info -->
      <div
          class="h-18 min-h-[4.2rem] flex items-center justify-between px-5 border-b border-base-200/80"
      >
        <div class="flex items-center gap-3">
          <div
              class="h-10 w-10 rounded-full bg-primary text-base-100 flex items-center justify-center text-sm font-semibold shadow-sm"
          >
            {{ adminInitials }}
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-[14px] text-base-content">
              {{ adminName || 'کاربر ادمین' }}
            </span>
            <span class="text-[11px] text-base-content/60 mt-0.5">
              حساب مدیریتی
            </span>
          </div>
        </div>
      </div>

      <!-- menu -->
      <nav
          class="flex-1 px-3 py-4 space-y-1 text-right overflow-y-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent"
      >
        <RouterLink
            v-for="item in menu"
            :key="item.to"
            :to="item.to"
            class="group flex items-center justify-between gap-2 px-4 py-3.5 rounded-2xl text-[14px] transition-all"
            :class="
            isActive(item.to)
              ? 'bg-primary/10 text-primary font-semibold shadow-sm'
              : 'text-base-content/80 hover:bg-base-200 hover:text-base-content'
          "
        >
          <div class="flex items-center gap-2">
            <span
                class="text-base-content/50 text-lg group-[.router-link-active]:text-primary"
            >
              {{ item.icon }}
            </span>
            <span>{{ item.label }}</span>
          </div>
          <span
              v-if="item.badge"
              class="text-[10px] px-2 py-0.5 rounded-full bg-base-200 text-base-content/60"
          >
            {{ item.badge }}
          </span>
        </RouterLink>
      </nav>

      <!-- bottom button: رفتن به سایت -->
      <div
          class="px-4 pb-4 pt-2 border-t border-base-200/80 flex justify-end"
      >
        <RouterLink
            to="/"
            class="btn btn-outline btn-xs sm:btn-sm rounded-full"
        >
          رفتن به سایت
        </RouterLink>
      </div>
    </aside>

    <!-- main -->
    <div
        class="flex-1 flex flex-col min-w-0 m-3 rounded-3xl bg-base-100/95 border border-base-300 shadow-xl overflow-hidden"
    >
      <!-- top bar فقط برای موبایل (فقط دکمه منو) -->
      <header
          class="h-12 bg-base-100 border-b border-base-200 flex items-center px-3 md:hidden"
      >
        <button
            class="btn btn-ghost btn-sm"
            @click="showSide = !showSide"
        >
          ☰
        </button>
      </header>

      <!-- mobile drawer -->
      <div
          v-if="showSide"
          class="fixed inset-0 bg-black/40 z-40 md:hidden"
          @click="showSide = false"
      >
        <div
            class="absolute right-0 top-0 bottom-0 w-64 bg-base-100 shadow-xl p-4 space-y-3"
            @click.stop
        >
          <div class="flex items-center justify-between mb-2">
            <p class="font-bold text-sm">منوی مدیریت</p>
            <button class="btn btn-ghost btn-xs" @click="showSide = false">
              ✕
            </button>
          </div>

          <RouterLink
              v-for="item in menu"
              :key="item.to"
              :to="item.to"
              class="flex items-center justify-between py-2 text-sm border-b border-base-200/60 last:border-b-0"
              :class="
              isActive(item.to)
                ? 'text-primary font-semibold'
                : 'text-base-content/80'
            "
              @click="showSide = false"
          >
            <span class="flex items-center gap-2">
              <span class="text-base-content/50 text-lg">
                {{ item.icon }}
              </span>
              {{ item.label }}
            </span>
            <span
                v-if="item.badge"
                class="text-[10px] px-2 py-0.5 rounded-full bg-base-200 text-base-content/60"
            >
              {{ item.badge }}
            </span>
          </RouterLink>

          <!-- روی موبایل هم یک دکمه رفتن به سایت -->
          <div class="pt-3">
            <RouterLink
                to="/"
                class="btn btn-outline btn-xs w-full rounded-full"
                @click="showSide = false"
            >
              رفتن به سایت
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- content -->
      <main class="flex-1 p-5 lg:p-8 overflow-x-hidden bg-base-50/70">
        <RouterView />
      </main>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showSide = ref(false)

interface MenuItem {
  label: string
  to: string
  icon?: string
  badge?: string
}

const menu: MenuItem[] = [
  { label: 'داشبورد', to: '/admin', icon: '📊' },
  { label: 'کاربران', to: '/admin/users', icon: '👥' },
  { label: 'سفارش‌ها', to: '/admin/orders', icon: '🧾' },
  { label: 'تیکت‌ها', to: '/admin/tickets', icon: '🎫' },
  { label: 'محصولات', to: '/admin/products', icon: '🛒' },
  { label: 'بنرها', to: '/admin/banners', icon: '🖼️' },
  { label: 'مقالات', to: '/admin/blogs', icon: '✏️' },
  { label: 'تنظیمات', to: '/admin/setting', icon: '🛠️' },
]

const isActive = (path: string) => {
  if (route.path === path) return true
  return route.path.startsWith(path + '/')
}

const adminName = ref('') // این رو بعد از لاگین از بک‌اند پر کن

// مثال: بعد از گرفتن اطلاعات از API
// adminName.value = response.data.name

const adminInitials = computed(() => {
  if (!adminName.value) return 'A'
  return adminName.value.trim().charAt(0).toUpperCase()
})
</script>
