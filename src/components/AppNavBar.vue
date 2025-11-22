<template>
  <header class="sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b border-base-300">
    <div class="navbar max-w-7xl mx-auto px-3 lg:px-4 relative">
      <!-- RIGHT / START -->
      <div class="navbar-start gap-2">
        <!-- mobile menu -->
        <button
            class="btn btn-ghost btn-circle lg:hidden"
            @click="drawerOpen = true"
            aria-label="menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- logo -->
        <RouterLink class="flex items-center gap-2" to="/">
          <div class="h-13 w-40 overflow-hidden flex items-center">
            <img
                :src="mithraLogo"
                alt="MithraPay"
                class="h-20 object-cover -translate-x-8 scale-125"
            />
          </div>
        </RouterLink>
      </div>

      <!-- CENTER MENU -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal gap-1 text-sm">
          <li><RouterLink to="/">صفحه اصلی</RouterLink></li>

          <!-- STORE -->
          <li class="group">
            <button class="flex items-center gap-1">
              فروشگاه
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <!-- MEGA (CENTERED) -->
            <div
                class="absolute left-1/2 top-full -translate-x-1/2 pt-4 z-40 hidden group-hover:block"
            >
              <div
                  class="mega-shell w-[1100px] max-w-[calc(100vw-1.5rem)]
                       rounded-2xl bg-base-100 shadow-xl border border-base-200
                       px-6 py-5 flex gap-6 flex-row-reverse"
              >
                <!-- promo box -->
                <div
                    class="w-[240px] rounded-xl bg-base-200/80 border border-base-200 flex flex-col justify-between p-4 text-right"
                >
                  <div>
                    <p class="text-sm text-base-content/70 mb-1">اکانت‌ها، گیفت‌کارت و لوازم</p>
                    <h3 class="text-lg font-bold mb-2">خرید آسان، تحویل سریع</h3>
                    <p class="text-xs text-base-content/60">
                      پشتیبانی حرفه‌ای و دسته‌بندی کامل محصولات
                    </p>
                  </div>
                  <RouterLink to="/shop" class="btn btn-sm btn-primary mt-4">مشاهده اکانت‌ها</RouterLink>
                </div>

                <!-- columns -->
                <div class="mega-panel grid grid-cols-4 gap-8 flex-1 text-right">
                  <!-- col 1 -->
                  <div class="mega-col">
                    <h3 class="font-semibold mb-2">اشتراک های پریمیوم اپل</h3>
                    <ul class="space-y-1.5 text-sm leading-relaxed">
                      <li><RouterLink class="hover:text-primary" to="/product/apple-one">اشتراک اپل وان</RouterLink></li>
                      <li><RouterLink class="hover:text-primary" to="/product/apple-music">اپل موزیک</RouterLink></li>
                      <li><RouterLink class="hover:text-primary" to="/product/icloud">فضای آیکلاد</RouterLink></li>
                      <li><RouterLink class="hover:text-primary" to="/product/apple-tv">اپل تی‌وی پلاس</RouterLink></li>
                    </ul>
                  </div>

                  <!-- col 2 -->
                  <div class="mega-col">
                    <h3 class="font-semibold mb-2">اشتراک های کاربردی</h3>
                    <ul class="space-y-1.5 text-sm leading-relaxed">
                      <li><RouterLink class="hover:text-primary" to="/category/accounts">یوتیوب پریمیوم</RouterLink></li>
                      <li><RouterLink class="hover:text-primary" to="/category/accounts">اسپاتیفای</RouterLink></li>
                      <li><RouterLink class="hover:text-primary" to="/category/accounts">تلگرام پریمیوم</RouterLink></li>
                      <li><RouterLink class="hover:text-primary" to="/category/accounts">کانوا</RouterLink></li>
                    </ul>
                  </div>

                  <!-- col 3 -->
                  <div class="mega-col">
                    <h3 class="font-semibold mb-2">گیفت کارت</h3>
                    <ul class="space-y-1.5 text-sm leading-relaxed">
                      <li><RouterLink class="hover:text-primary" to="/category/gift-cards">گیفت کارت اپل</RouterLink></li>
                      <li><RouterLink class="hover:text-primary" to="/category/gift-cards">گیفت کارت پلی‌استیشن</RouterLink></li>
                      <li><RouterLink class="hover:text-primary" to="/category/gift-cards">گیفت کارت آمازون</RouterLink></li>
                      <li><RouterLink class="hover:text-primary" to="/category/gift-cards">گیفت کارت استیم</RouterLink></li>
                    </ul>
                  </div>

                  <!-- col 4 -->
                  <div class="mega-col">
                    <h3 class="font-semibold mb-2">خدمات</h3>
                    <ul class="space-y-1.5 text-sm leading-relaxed">
                      <li><RouterLink class="hover:text-primary" to="/support">ساخت اپل آیدی</RouterLink></li>
                      <li><RouterLink class="hover:text-primary" to="/support">فعالسازی اشتراک</RouterLink></li>
                      <li><RouterLink class="hover:text-primary" to="/support">پشتیبانی</RouterLink></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li><RouterLink to="/blog">وبلاگ</RouterLink></li>
          <li><RouterLink to="/support">ارتباط با ما</RouterLink></li>
          <li><RouterLink to="/about">درباره ما</RouterLink></li>
        </ul>
      </div>

      <!-- LEFT / END -->
      <div class="navbar-end gap-3">
        <label class="input input-bordered items-center gap-2 hidden lg:flex">
          <input
              type="text"
              class="grow"
              placeholder="جستجو..."
              @keyup.enter="goSearch"
              v-model="q"
          />
          <kbd class="kbd kbd-sm"><img src="@/assets/icons/search.png" /> </kbd>
        </label>

        <button class="btn btn-ghost btn-circle" @click="openCart" aria-label="cart">
          <div class="indicator">
            <img src="@/assets/icons/card.png">
            <span v-if="cartCount" class="badge badge-sm indicator-item">{{ cartCount }}</span>
          </div>
        </button>

        <div class="hidden md:flex items-center gap-2 text-sm">
          <template v-if="isLoggedIn">
            <!-- User avatar / icon -->
            <button
                class="btn btn-ghost btn-circle"
                @click="goProfile"
                aria-label="profile"
            >
              <div class="avatar placeholder">
                <div class="bg-primary text-primary-content rounded-full w-9">
                  <span class="text-sm">{{ userInitial }}</span>
                </div>
              </div>
            </button>
          </template>

          <template v-else>
            <RouterLink to="/auth/login" class="hover:text-primary whitespace-nowrap">
              وارد شوید
            </RouterLink>
            <span class="opacity-30">|</span>
            <RouterLink to="/auth/login" class="hover:text-primary whitespace-nowrap">
              عضویت
            </RouterLink>
          </template>
        </div>


        <button class="btn btn-ghost btn-circle lg:hidden" @click="goSearch">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m21 21-5.2-5.2m0-6.3a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import mithraLogo from '@/assets/logo.webp'
import { useUiStore } from '@/stores/ui'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const ui = useUiStore()
const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()

const drawerOpen = ref(false)
const q = ref('')

const cartCount = computed(() => cart.count)
const isLoggedIn = computed(() => auth.isAuthenticated)
const userInitial = computed(() => {
  if (auth.user?.name) return auth.user.name.charAt(0)
  if (auth.user?.phone) return auth.user.phone.slice(-2)
  return '👤'
})

const openCart = () => ui.openCart()

function goSearch() {
  if (!q.value) return
  router.push({ name: 'search', query: { q: q.value } })
}

function goProfile() {
  router.push({ name: 'profile' })  // /profile -> ProfilePage.vue
}

onMounted(() => ui.init())
</script>


<style scoped>
/* hard reset borders INSIDE panel (daisyui likes to add some) */
:deep(.mega-panel > .mega-col),
:deep(.mega-panel > .mega-col *){
  border: 0 !important;
  box-shadow: none !important;
}

/* make sure panel itself stays RTL */
.mega-panel {
  direction: rtl;
}
</style>
