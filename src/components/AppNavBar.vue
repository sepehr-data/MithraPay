<template>
  <header class="sticky top-0 z-50 border-b border-base-200 bg-base-100/80 backdrop-blur">
    <div class="navbar max-w-6xl mx-auto px-4 lg:px-0">
      <!-- RIGHT / START -->
      <div class="navbar-start w-auto flex items-center gap-2 lg:w-auto">
        <!-- mobile menu -->
        <div class="dropdown lg:hidden">
          <label tabindex="0" class="btn btn-ghost btn-circle" aria-label="menu" @click="drawerOpen = true">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul
              tabindex="0"
              class="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-base-100 rounded-2xl w-64 border border-base-200"
          >
            <li><RouterLink to="/">صفحه اصلی</RouterLink></li>
            <li>
              <details class="w-full">
                <summary>فروشگاه</summary>
                <ul class="p-2 space-y-1">
                  <li><RouterLink to="/product/apple-one">اشتراک اپل وان</RouterLink></li>
                  <li><RouterLink to="/product/apple-music">اپل موزیک</RouterLink></li>
                  <li><RouterLink to="/product/icloud">فضای آیکلاد</RouterLink></li>
                  <li><RouterLink to="/product/apple-tv">اپل تی‌وی پلاس</RouterLink></li>
                  <li><RouterLink to="/category/accounts">یوتیوب پریمیوم</RouterLink></li>
                  <li><RouterLink to="/category/accounts">اسپاتیفای</RouterLink></li>
                  <li><RouterLink to="/category/gift-cards">گیفت کارت اپل</RouterLink></li>
                  <li><RouterLink to="/category/gift-cards">گیفت کارت پلی‌استیشن</RouterLink></li>
                  <li><RouterLink to="/category/gift-cards">گیفت کارت آمازون</RouterLink></li>
                  <li><RouterLink to="/category/gift-cards">گیفت کارت استیم</RouterLink></li>
                  <li><RouterLink to="/support">ساخت اپل آیدی</RouterLink></li>
                  <li><RouterLink to="/support">فعالسازی اشتراک</RouterLink></li>
                  <li><RouterLink to="/support">پشتیبانی</RouterLink></li>
                </ul>
              </details>
            </li>
            <li><RouterLink to="/blog">وبلاگ</RouterLink></li>
            <li><RouterLink to="/support">ارتباط با ما</RouterLink></li>
            <li><RouterLink to="/about">درباره ما</RouterLink></li>
          </ul>
        </div>

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
      <div class="navbar-center hidden lg:flex flex-1 justify-center relative">
        <ul class="menu menu-horizontal gap-1 text-sm font-semibold max-w-[540px] justify-center">
          <li><RouterLink class="rounded-full px-4" to="/">صفحه اصلی</RouterLink></li>

          <!-- STORE -->
          <li
              class="relative"
              @mouseenter="openStoreMenu"
              @mouseleave="scheduleCloseStoreMenu"
          >
            <button
                class="flex items-center gap-1 rounded-full px-4"
                type="button"
                @click.prevent="toggleStoreMenu"
            >
              فروشگاه
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <!-- MEGA MENU (مثل قبل، وسط، پهن) -->
            <div
                v-show="isStoreMenuOpen"
                class="absolute left-1/2 top-full lg:-translate-x-[60%] -translate-x-1/2 pt-4 z-40 w-screen max-w-6xl px-4"
                @mouseenter="openStoreMenu"
                @mouseleave="scheduleCloseStoreMenu"
            >

              <div
                  class="mega-shell w-full lg:w-[88vw] xl:w-[82vw] mx-auto
                       rounded-2xl bg-base-100 shadow-2xl border border-base-200/80
                       px-5 sm:px-6 lg:px-8 py-6 flex flex-col gap-6"
              >
                <div class="flex flex-col gap-4 text-right lg:flex-row lg:items-start lg:gap-8">
                  <!-- promo box -->
                  <div
                      class="lg:w-[240px] rounded-2xl bg-base-200/80 border border-base-200 flex flex-col justify-between p-5 text-right shadow-sm"
                  >
                    <div>
                      <p class="text-sm text-base-content/70 mb-2">اکانت‌ها، گیفت‌کارت و لوازم</p>
                      <h3 class="text-lg font-bold mb-3 leading-7">خرید آسان، تحویل سریع</h3>
                      <p class="text-xs text-base-content/60 leading-6">
                        پشتیبانی حرفه‌ای، ارسال سریع و چیدمان دقیق محصولات محبوب شما.
                      </p>
                    </div>
                    <RouterLink to="/shop" class="btn btn-sm btn-primary mt-5 rounded-full">
                      مشاهده اکانت‌ها
                    </RouterLink>
                  </div>

                  <!-- columns -->
                  <div class="mega-panel grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 flex-1 text-right">
                    <!-- col 1 -->
                    <div class="mega-col">
                      <h3 class="mega-title">اشتراک های پریمیوم اپل</h3>
                      <ul class="mega-list">
                        <li><RouterLink class="mega-link" to="/product/apple-one">اشتراک اپل وان</RouterLink></li>
                        <li><RouterLink class="mega-link" to="/product/apple-music">اپل موزیک</RouterLink></li>
                        <li><RouterLink class="mega-link" to="/product/icloud">فضای آیکلاد</RouterLink></li>
                        <li><RouterLink class="mega-link" to="/product/apple-tv">اپل تی‌وی پلاس</RouterLink></li>
                      </ul>
                    </div>

                    <!-- col 2 -->
                    <div class="mega-col">
                      <h3 class="mega-title">اشتراک های کاربردی</h3>
                      <ul class="mega-list">
                        <li><RouterLink class="mega-link" to="/category/accounts">یوتیوب پریمیوم</RouterLink></li>
                        <li><RouterLink class="mega-link" to="/category/accounts">اسپاتیفای</RouterLink></li>
                        <li><RouterLink class="mega-link" to="/category/accounts">تلگرام پریمیوم</RouterLink></li>
                        <li><RouterLink class="mega-link" to="/category/accounts">کانوا</RouterLink></li>
                      </ul>
                    </div>

                    <!-- col 3 -->
                    <div class="mega-col">
                      <h3 class="mega-title">گیفت کارت</h3>
                      <ul class="mega-list">
                        <li><RouterLink class="mega-link" to="/category/gift-cards">گیفت کارت اپل</RouterLink></li>
                        <li><RouterLink class="mega-link" to="/category/gift-cards">گیفت کارت پلی‌استیشن</RouterLink></li>
                        <li><RouterLink class="mega-link" to="/category/gift-cards">گیفت کارت آمازون</RouterLink></li>
                        <li><RouterLink class="mega-link" to="/category/gift-cards">گیفت کارت استیم</RouterLink></li>
                      </ul>
                    </div>

                    <!-- col 4 -->
                    <div class="mega-col">
                      <h3 class="mega-title">خدمات</h3>
                      <ul class="mega-list">
                        <li><RouterLink class="mega-link" to="/support">ساخت اپل آیدی</RouterLink></li>
                        <li><RouterLink class="mega-link" to="/support">فعالسازی اشتراک</RouterLink></li>
                        <li><RouterLink class="mega-link" to="/support">پشتیبانی</RouterLink></li>
                        <li><a class="mega-link" href="#">مشاوره خرید</a></li>
                      </ul>
                    </div>

                    <!-- (جای یه ستون خالی/آیتم‌های بعدی) -->
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li><RouterLink class="rounded-full px-4" to="/blog">وبلاگ</RouterLink></li>
          <li><RouterLink class="rounded-full px-4" to="/support">ارتباط با ما</RouterLink></li>
          <li><RouterLink class="rounded-full px-4" to="/about">درباره ما</RouterLink></li>
        </ul>
      </div>

      <!-- LEFT / END -->
      <div class="navbar-end gap-3 w-auto lg:w-auto justify-end flex-shrink-0">
        <label
            class="input input-bordered items-center gap-2 hidden lg:flex bg-base-100/80 rounded-full shadow-sm max-w-xs"
        >
          <input
              type="text"
              class="grow text-sm"
              placeholder="جستجو..."
              @keyup.enter="goSearch"
              v-model="q"
          />
          <!-- آیکون بدون کادر -->
          <span class="inline-flex items-center justify-center">
            <img src="@/assets/icons/search.png" alt="جستجو" class="w-4 h-4" />
          </span>
        </label>

        <button class="btn btn-ghost btn-circle" @click="openCart" aria-label="cart">
          <div class="indicator">
            <img src="@/assets/icons/card.png">
            <span v-if="cartCount" class="badge badge-sm indicator-item">{{ cartCount }}</span>
          </div>
        </button>

        <div class="hidden md:flex items-center gap-2 text-sm">
          <template v-if="isLoggedIn">
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
            <RouterLink to="/auth/login" class="btn btn-sm btn-primary rounded-full px-4">وارد شوید</RouterLink>
            <RouterLink to="/auth/login" class="btn btn-sm btn-ghost rounded-full px-4 border border-base-200">
              عضویت
            </RouterLink>
          </template>
        </div>

        <button class="btn btn-ghost btn-circle lg:hidden" @click="goSearch">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="m21 21-5.2-5.2m0-6.3a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>


<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import mithraLogo from '@/assets/logo3.png'
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
const isStoreMenuOpen = ref(false)
let storeMenuTimer: number | undefined

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

function openStoreMenu() {
  if (storeMenuTimer) clearTimeout(storeMenuTimer)
  isStoreMenuOpen.value = true
}

function scheduleCloseStoreMenu() {
  if (storeMenuTimer) clearTimeout(storeMenuTimer)
  storeMenuTimer = window.setTimeout(() => {
    isStoreMenuOpen.value = false
  }, 120)
}

function toggleStoreMenu() {
  if (storeMenuTimer) clearTimeout(storeMenuTimer)
  isStoreMenuOpen.value = !isStoreMenuOpen.value
}

onMounted(() => ui.init())

onBeforeUnmount(() => {
  if (storeMenuTimer) clearTimeout(storeMenuTimer)
})
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

.mega-title {
  @apply text-base font-bold mb-3 text-base-content;
}

.mega-list {
  @apply space-y-2 text-sm leading-relaxed;
}

.mega-link {
  @apply block px-2 py-1.5 rounded-lg transition-colors duration-200 text-base-content/80;
}

.mega-link:hover,
.mega-link:focus-visible {
  @apply text-primary bg-primary/10;
}

@media (max-width: 1023px) {
  .mega-shell {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  }
}
</style>
