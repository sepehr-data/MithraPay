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
          <li>
            <RouterLink class="rounded-full px-4 nav-pill" to="/">صفحه اصلی</RouterLink>
          </li>

          <!-- STORE -->
          <li
              class="relative"
              @mouseenter="openStoreMenu"
              @mouseleave="scheduleCloseStoreMenu"
          >
            <button
                class="flex items-center gap-1 rounded-full px-4 nav-pill"
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
          <li>
            <RouterLink class="rounded-full px-4 nav-pill" to="/blog">وبلاگ</RouterLink>
          </li>
          <li>
            <RouterLink class="rounded-full px-4 nav-pill" to="/support">ارتباط با ما</RouterLink>
          </li>
          <li>
            <RouterLink class="rounded-full px-4 nav-pill" to="/about">درباره ما</RouterLink>
          </li>
        </ul>
      </div>

      <!-- LEFT / END -->
      <div class="navbar-end gap-3 w-auto lg:w-auto justify-end flex-shrink-0">
        <div class="nav-search hidden lg:flex">
          <input
              type="text"
              class="nav-search-input"
              placeholder="جستجو ..."
              v-model="q"
              @keyup.enter="goSearch"
          />

          <button
              type="button"
              class="nav-search-btn"
              @click="goSearch"
              aria-label="جستجو"
          >
            <img src="@/assets/icons/search.png" alt="جستجو" class="w-4 h-4" />
          </button>
        </div>

        <button
            class="btn btn-ghost btn-circle cart-btn"
            @click="openCart"
            aria-label="cart"
        >
          <div class="indicator">
            <img src="@/assets/icons/card.png" alt="سبد" class="cart-icon-img" />
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
  router.push({ name: 'profile' })
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
/* خود دکمه: رفتار دیفالت دِیزی‌یو‌آی، فقط هاورش رو خنثی می‌کنیم */
.cart-btn {
  background-color: transparent;
  border-color: transparent;
}

.cart-btn:hover,
.cart-btn:focus-visible {
  background-color: transparent !important;
  border-color: transparent !important;
  box-shadow: none;
}

.cart-icon-img {
  width: 1.4rem;
  height: 1.4rem;
  transition:
      transform 0.2s ease,
      filter 0.2s ease,
      opacity 0.2s ease;
  opacity: 0.9;
}

.cart-btn:hover .cart-icon-img,
.cart-btn:focus-visible .cart-icon-img {
  transform: translateY(-1px);
  opacity: 1;
  filter: invert(18%) sepia(80%) saturate(2100%) hue-rotate(340deg) brightness(90%) contrast(95%);
}

.nav-search {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.35rem;
  width: 2.6rem;
  padding: 0.3rem;
  border-radius: 9999px;
  background-color: hsla(var(--b1), 0.96);
  border: 1px solid hsla(var(--bc), 0.18);
  overflow: hidden;
  transition:
      width 0.28s ease,
      background-color 0.22s ease,
      border-color 0.22s ease,
      box-shadow 0.22s ease,
      transform 0.18s ease;
}

.nav-search:hover,
.nav-search:focus-within {
  width: 15rem;
  background-color: hsla(var(--b1), 1);
  border-color: hsla(var(--p), 0.8);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.16);
  transform: translateY(-1px);
}

.nav-search-input {
  flex: 1 1 auto;
  border: none;
  background: transparent;
  outline: none;
  color: hsl(var(--bc));
  font-size: 0.86rem;
  padding-inline-start: 0.3rem;
  opacity: 0;
  transform: translateX(8px);
  transition:
      opacity 0.22s ease,
      transform 0.22s ease;
}

.nav-search:hover .nav-search-input,
.nav-search:focus-within .nav-search-input {
  opacity: 1;
  transform: translateX(0);
}

.nav-search-input::placeholder {
  color: hsla(var(--bc), 0.4);
  transition: color 0.18s ease;
}

.nav-search:focus-within .nav-search-input::placeholder {
  color: hsla(var(--bc), 0.25);
}

.nav-search-btn {
  flex-shrink: 0;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 9999px;
  border: none;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: hsl(var(--p));
  box-shadow: 0 8px 18px hsla(var(--p), 0.4);
  cursor: pointer;
  transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      background-color 0.18s ease;
}

.nav-search-btn:hover {
  transform: translateY(-1px) scale(1.03);
  box-shadow: 0 12px 26px hsla(var(--p), 0.5);
}

.nav-search-btn img {
  transition: transform 0.18s ease, opacity 0.18s ease;
  opacity: 0.9;
}

.nav-search-btn:hover img {
  transform: translateX(-1px);
  opacity: 1;
}

.nav-pill {
  position: relative;
  padding: 0.35rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.9rem;
  color: hsl(var(--bc));
  transition:
      color 0.22s ease,
      transform 0.22s ease;
}

.nav-pill::after {
  content: "";
  position: absolute;
  left: 18%;
  right: 18%;
  bottom: 0;
  height: 2px;
  border-radius: 9999px;
  background: linear-gradient(
      90deg,
      rgba(59, 130, 246, 0.9),
      rgba(56, 189, 248, 0.9)
  );
  transform: scaleX(0);
  transform-origin: right center;
  transition: transform 0.23s ease-out;
}

.nav-pill:hover {
  color: hsl(var(--p));
  transform: translateY(-1px);
}

.nav-pill:hover::after {
  transform-origin: left center;
  transform: scaleX(1);
}

.nav-pill.router-link-active,
.nav-pill[aria-current="page"] {
  color: hsl(var(--p));
}

.nav-pill.router-link-active::after,
.nav-pill[aria-current="page"]::after {
  transform-origin: left center;
  transform: scaleX(1);
}

:deep(.mega-panel > .mega-col),
:deep(.mega-panel > .mega-col *){
  border: 0 !important;
  box-shadow: none !important;
}

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
