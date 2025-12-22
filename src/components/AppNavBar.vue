<template>
  <header id="app-navbar" class="sticky top-0 z-50 border-b border-base-200 bg-base-100/80 backdrop-blur">
  <div class="navbar max-w-6xl mx-auto px-4 lg:px-0 lg:translate-x-24">
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
            <img :src="mithraLogo" alt="MithraPay" class="h-20 object-cover -translate-x-8 scale-125" />
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
          <li class="relative" @mouseenter="openStoreMenu" @mouseleave="scheduleCloseStoreMenu">
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

            <Transition name="mega-slide">
              <div
                  v-if="isStoreMenuOpen"
                  class="absolute left-1/2 top-full z-40 w-screen max-w-6xl px-4 pt-3 -translate-x-1/2 lg:-translate-x-[60%]"
                  @mouseenter="openStoreMenu"
                  @mouseleave="scheduleCloseStoreMenu"
              >
                <div
                    class="w-full lg:w-[88vw] xl:w-[82vw] mx-auto rounded-xl bg-base-100 border border-base-200 shadow-lg px-4 sm:px-5 lg:px-6 py-4 flex flex-col gap-4"
                >
                  <div class="flex flex-col gap-4 text-right lg:flex-row lg:items-start lg:gap-6">
                    <!-- intro box -->
                    <div
                        class="lg:w-[230px] relative overflow-hidden rounded-xl bg-gradient-to-b from-primary/10 via-base-100 to-base-100 border border-primary/20 shadow-md p-4 flex flex-col justify-between"
                    >
                      <div class="pointer-events-none absolute -left-10 -top-10 w-24 h-24 bg-primary/20 blur-3xl opacity-60"></div>
                      <div class="pointer-events-none absolute -right-8 bottom-[-24px] w-24 h-24 bg-secondary/10 blur-3xl opacity-70"></div>

                      <div class="relative space-y-2">
                        <p class="text-[11px] text-base-content/60">اشتراک، اکانت و گیفت‌کارت دیجیتال</p>
                        <h3 class="text-base font-semibold text-base-content">همه چیز برای خرید بی‌دردسر</h3>
                        <p class="text-xs text-base-content/70 leading-5">
                          تو سپهر باکس فقط سرویس مورد نظرت رو انتخاب کن؛
                          بقیه‌ش با ماست؛ پرداخت راحت، تحویل سریع اشتراک و پشتیبانی که واقعاً جواب می‌ده.
                        </p>
                      </div>

                      <RouterLink to="/shop" class="relative btn btn-sm btn-primary mt-4 rounded-full w-full justify-center">
                        مشاهده محصولات
                      </RouterLink>
                    </div>

                    <!-- columns -->
                    <div class="grid flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-right">
                      <div class="space-y-2">
                        <h3 class="text-xs font-semibold text-base-content/80 border-b border-base-200 pb-1.5">اشتراک‌های پریمیوم اپل</h3>
                        <ul class="space-y-1">
                          <li><RouterLink class="mega-link" to="/product/apple-one">اشتراک اپل وان</RouterLink></li>
                          <li><RouterLink class="mega-link" to="/product/apple-music">اپل موزیک</RouterLink></li>
                          <li><RouterLink class="mega-link" to="/product/icloud">فضای آیکلاد</RouterLink></li>
                          <li><RouterLink class="mega-link" to="/product/apple-tv">اپل تی‌وی پلاس</RouterLink></li>
                        </ul>
                      </div>

                      <div class="space-y-2">
                        <h3 class="text-xs font-semibold text-base-content/80 border-b border-base-200 pb-1.5">اشتراک‌های کاربردی</h3>
                        <ul class="space-y-1">
                          <li><RouterLink class="mega-link" to="/category/accounts">یوتیوب پریمیوم</RouterLink></li>
                          <li><RouterLink class="mega-link" to="/category/accounts">اسپاتیفای</RouterLink></li>
                          <li><RouterLink class="mega-link" to="/category/accounts">تلگرام پریمیوم</RouterLink></li>
                          <li><RouterLink class="mega-link" to="/category/accounts">کانوا</RouterLink></li>
                        </ul>
                      </div>

                      <div class="space-y-2">
                        <h3 class="text-xs font-semibold text-base-content/80 border-b border-base-200 pb-1.5">گیفت کارت</h3>
                        <ul class="space-y-1">
                          <li><RouterLink class="mega-link" to="/category/gift-cards">گیفت کارت اپل</RouterLink></li>
                          <li><RouterLink class="mega-link" to="/category/gift-cards">گیفت کارت پلی‌استیشن</RouterLink></li>
                          <li><RouterLink class="mega-link" to="/category/gift-cards">گیفت کارت آمازون</RouterLink></li>
                          <li><RouterLink class="mega-link" to="/category/gift-cards">گیفت کارت استیم</RouterLink></li>
                        </ul>
                      </div>

                      <div class="space-y-2">
                        <h3 class="text-xs font-semibold text-base-content/80 border-b border-base-200 pb-1.5">خدمات و پشتیبانی</h3>
                        <ul class="space-y-1">
                          <li><RouterLink class="mega-link" to="/support">ساخت اپل آیدی</RouterLink></li>
                          <li><RouterLink class="mega-link" to="/support">فعالسازی اشتراک</RouterLink></li>
                          <li><RouterLink class="mega-link" to="/support">پشتیبانی</RouterLink></li>
                          <li><a class="mega-link" href="#">مشاوره خرید</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </li>

          <li><RouterLink class="rounded-full px-4 nav-pill" to="/blog">وبلاگ</RouterLink></li>
          <li><RouterLink class="rounded-full px-4 nav-pill" to="/support">ارتباط با ما</RouterLink></li>
          <li><RouterLink class="rounded-full px-4 nav-pill" to="/about">درباره ما</RouterLink></li>
        </ul>
      </div>

      <!-- LEFT / END -->
      <div class="navbar-end gap-3 w-auto lg:w-auto justify-end flex-shrink-0">
        <div class="nav-search hidden lg:flex" ref="navSearchRef">
        <input
              type="text"
              class="nav-search-input"
              placeholder="جستجو ..."
              v-model="q"
              @keyup.enter="goSearch"
          />

          <button type="button" class="nav-search-btn" @click="goSearch" aria-label="جستجو">
            <img src="@/assets/icons/search.png" alt="جستجو" class="w-4 h-4" />
          </button>
        </div>

        <!-- cart -->
        <button class="btn btn-ghost btn-circle cart-btn" @click="openCart" aria-label="cart">
          <div class="indicator">
            <img src="@/assets/icons/card.png" alt="سبد" class="cart-icon-img" />
            <span v-if="cartCount" class="badge badge-sm indicator-item">{{ cartCount }}</span>
          </div>
        </button>

        <!-- ✅ USER MENU (کلیک محور + شرطی) -->
        <div class="relative hidden md:block" ref="userMenuRef">
          <button
              type="button"
              class="btn btn-ghost btn-circle user-btn"
              aria-label="user menu"
              @click="toggleUserMenu"
          >
            <img src="@/assets/icons/user.png" alt="کاربر" class="user-icon-img" />
          </button>

          <transition name="fade-pop">
            <div v-if="isUserMenuOpen" class="absolute left-0 top-full mt-3 w-60 z-50">
              <div class="p-2 shadow-xl bg-base-100 rounded-2xl border border-base-200 user-menu">

              <!-- اگر لاگین نیست: فقط ورود -->
                <template v-if="!isLoggedIn">
                  <RouterLink
                      :to="{ name: 'login' }"
                      class="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-base-200/60"
                      @click="closeUserMenu"
                  >
                    <span class="font-semibold">ورود به حساب کاربری</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 18l-6-6 6-6" />
                    </svg>
                  </RouterLink>
                </template>

                <!-- اگر لاگین هست -->
                <template v-else>
                  <!-- نام + فلش -> پروفایل -->
                  <button
                      type="button"
                      class="flex w-full items-center justify-between px-3 py-2 rounded-xl hover:bg-base-200/60"
                      @click="goProfileFromMenu"
                  >
                    <span class="font-semibold truncate max-w-[170px]">{{ userDisplayName }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  <div class="h-px my-1 bg-base-200"></div>

                  <button
                      type="button"
                      class="w-full text-right px-3 py-2 rounded-xl hover:bg-base-200/60"
                      @click="goOrdersFromMenu"
                  >
                    سفارش‌ها
                  </button>

                  <button
                      type="button"
                      class="w-full text-right px-3 py-2 rounded-xl hover:bg-base-200/60"
                      @click="goFavoritesFromMenu"
                  >
                    علاقه‌مندی‌ها
                  </button>

                  <div class="h-px my-1 bg-base-200"></div>

                  <button
                      type="button"
                      class="w-full text-right px-3 py-2 rounded-xl hover:bg-base-200/60 text-error"
                      @click="logoutFromMenu"
                  >
                    خروج از حساب
                  </button>
                </template>
              </div>
            </div>
          </transition>
        </div>

        <!-- login (فقط وقتی لاگین نیست) -->
        <div class="hidden md:flex items-center gap-2 text-sm">
          <template v-if="!isLoggedIn">
            <RouterLink :to="{ name: 'login' }" class="btn btn-sm btn-primary rounded-full px-4">
              وارد شوید
            </RouterLink>
          </template>
        </div>

        <!-- mobile search icon -->
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
import { ref, onMounted, computed, onBeforeUnmount, watch, nextTick } from 'vue'
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

// ✅ User dropdown state
const isUserMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

// ✅ Search open/close tracking (برای پاک شدن بعد از بسته شدن)
const navSearchRef = ref<HTMLElement | null>(null)
const isSearchOpen = ref(false)
let searchCheckTimer: number | undefined
let searchClearTimer: number | undefined

// ✅ چون cart.count تو تایپ استور وجود نداره، از items محاسبه می‌کنیم
const cartCount = computed(() => {
  const items: any[] = (cart as any).items || []
  return items.reduce((sum, it) => sum + Number(it.quantity ?? it.qty ?? 1), 0)
})

const isLoggedIn = computed(() => auth.isAuthenticated)

const userDisplayName = computed(() => {
  if (auth.user?.name) return auth.user.name
  if (auth.user?.phone) return `کاربر ${auth.user.phone}`
  return 'کاربر'
})

const openCart = () => ui.openCart()

/* ====== Search ======
   شرط جدید: پاک شدن q بعد از هر بار باز/بسته شدن سرچ‌بار (ترنزیشن)
*/
async function goSearch() {
  const term = String(q.value || '').trim()
  if (!term) return

  try {
    if (router.currentRoute.value.name === 'search') {
      await router.replace({ name: 'search', query: { q: term } })
    } else {
      await router.push({ name: 'search', query: { q: term } })
    }
  } catch (e) {
    // ignore navigation errors
  } finally {
    // ✅ برای اینکه سرچ‌بار واقعاً بسته شه (تا watcher پاک کنه)، فوکوس داخلش رو blur می‌کنیم
    const wrap = navSearchRef.value
    const active = document.activeElement as HTMLElement | null
    if (wrap && active && wrap.contains(active)) active.blur()
  }
}

/* ====== User menu open/close (click) ====== */
function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value
}
function closeUserMenu() {
  isUserMenuOpen.value = false
}
function onDocClick(e: MouseEvent) {
  if (!isUserMenuOpen.value) return
  const el = userMenuRef.value
  if (!el) return
  if (el.contains(e.target as Node)) return
  closeUserMenu()
}
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeUserMenu()
}

// wrappers: بعد از کلیک، منو بسته شود
function goProfileFromMenu() {
  closeUserMenu()
  router.push({ name: 'profile' })
}
function goOrdersFromMenu() {
  closeUserMenu()
  router.push('/orders')
}
function goFavoritesFromMenu() {
  closeUserMenu()
  router.push('/favorites')
}
function logoutFromMenu() {
  closeUserMenu()
  const anyAuth = auth as any
  if (typeof anyAuth.logout === 'function') {
    anyAuth.logout()
  } else {
    localStorage.removeItem('token')
    localStorage.removeItem('auth')
  }
  router.push({ name: 'login' })
}

/* ====== Store mega menu ====== */
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

/* ====== Nav search open/close detector ====== */
function openSearchBar() {
  if (searchCheckTimer) clearTimeout(searchCheckTimer)
  isSearchOpen.value = true
}

function scheduleCloseSearchBar() {
  if (searchCheckTimer) clearTimeout(searchCheckTimer)

  // کمی صبر می‌کنیم تا جابه‌جایی فوکوس بین input و دکمه باعث بسته شدن اشتباهی نشه
  searchCheckTimer = window.setTimeout(() => {
    const el = navSearchRef.value
    if (!el) {
      isSearchOpen.value = false
      return
    }

    const active = document.activeElement as HTMLElement | null
    const focusedInside = !!active && el.contains(active)
    const hovered = el.matches(':hover')

    // اگر هنوز hover یا focus داخلش هست، بسته نکن
    if (focusedInside || hovered) return

    isSearchOpen.value = false
  }, 80)
}

// ✅ بعد از بسته شدن (پایان ترنزیشن)، q پاک شود
watch(isSearchOpen, (open) => {
  if (searchClearTimer) clearTimeout(searchClearTimer)

  if (!open) {
    // ترنزیشن width شما 0.28s است؛ کمی بیشتر برای اطمینان
    searchClearTimer = window.setTimeout(() => {
      if (!isSearchOpen.value) q.value = ''
    }, 320)
  }
})

function bindNavSearchEvents() {
  const el = navSearchRef.value
  if (!el) return

  el.addEventListener('mouseenter', openSearchBar)
  el.addEventListener('mouseleave', scheduleCloseSearchBar)
  el.addEventListener('focusin', openSearchBar)
  el.addEventListener('focusout', scheduleCloseSearchBar)
}

function unbindNavSearchEvents() {
  const el = navSearchRef.value
  if (!el) return

  el.removeEventListener('mouseenter', openSearchBar)
  el.removeEventListener('mouseleave', scheduleCloseSearchBar)
  el.removeEventListener('focusin', openSearchBar)
  el.removeEventListener('focusout', scheduleCloseSearchBar)
}

onMounted(async () => {
  ui.init()
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeyDown)

  await nextTick()
  bindNavSearchEvents()
})

onBeforeUnmount(() => {
  if (storeMenuTimer) clearTimeout(storeMenuTimer)
  if (searchCheckTimer) clearTimeout(searchCheckTimer)
  if (searchClearTimer) clearTimeout(searchClearTimer)

  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeyDown)

  unbindNavSearchEvents()
})
</script>

<style scoped>
/* cart */
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
  transition: transform 0.2s ease, filter 0.2s ease, opacity 0.2s ease;
  opacity: 0.9;
}
.cart-btn:hover .cart-icon-img,
.cart-btn:focus-visible .cart-icon-img {
  transform: translateY(-1px);
  opacity: 1;
  filter: invert(18%) sepia(80%) saturate(2100%) hue-rotate(340deg) brightness(90%) contrast(95%);
}

/* user */
.user-btn {
  background-color: transparent;
  border-color: transparent;
}
.user-btn:hover,
.user-btn:focus-visible {
  background-color: transparent !important;
  border-color: transparent !important;
  box-shadow: none;
}
.user-icon-img {
  width: 1.35rem;
  height: 1.35rem;
  opacity: 0.9;
  transition: transform 0.2s ease, filter 0.2s ease, opacity 0.2s ease;
}
.user-btn:hover .user-icon-img,
.user-btn:focus-visible .user-icon-img {
  transform: translateY(-1px);
  opacity: 1;
  /* ✅ مشکی تیره به جای قرمز */
  filter: brightness(0) saturate(100%);
}

/* dropdown animation */
.fade-pop-enter-active,
.fade-pop-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.fade-pop-enter-from,
.fade-pop-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}

/* search */
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
  transition: width 0.28s ease, background-color 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease,
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
  transition: opacity 0.22s ease, transform 0.22s ease;
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
  transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
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

/* nav pills */
.nav-pill {
  position: relative;
  padding: 0.35rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.9rem;
  color: hsl(var(--bc));
  transition: color 0.22s ease, transform 0.22s ease;
}
.nav-pill::after {
  content: '';
  position: absolute;
  left: 18%;
  right: 18%;
  bottom: 0;
  height: 2px;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.9), rgba(56, 189, 248, 0.9));
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
.nav-pill[aria-current='page'] {
  color: hsl(var(--p));
}
.nav-pill.router-link-active::after,
.nav-pill[aria-current='page']::after {
  transform-origin: left center;
  transform: scaleX(1);
}

/* mega menu */
.mega-link {
  @apply block px-2 py-1.5 rounded-lg transition-colors duration-200 text-base-content/80;
}
.mega-link:hover,
.mega-link:focus-visible {
  @apply text-primary bg-primary/10;
}

/* user dropdown typography */
.user-menu {
  font-size: 0.9rem; /* کوچیک‌تر (می‌تونی 0.78 هم بزاری) */
  font-weight: 400;  /* حذف بولدی کلی */
}

/* اگر فقط اسم کاربر رو می‌خوای نیمه‌بولد بمونه (اختیاری) */
.user-menu .user-menu__name {
  font-weight: 600;
}

</style>
