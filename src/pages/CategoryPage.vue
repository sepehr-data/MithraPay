<template>
  <div class="category-page">
    <div class="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-6 sm:py-8 space-y-8 lg:space-y-10">
      <!-- Hero -->
      <section class="space-y-3">
        <Breadcrumbs :crumbs="[{ title: 'دسته‌بندی' }, { title: catTitle }]" />

        <div class="relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
          <div aria-hidden="true" class="pointer-events-none absolute -inset-20 opacity-80">
            <div class="absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>
            <div class="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-secondary/15 blur-3xl"></div>
          </div>

          <div class="relative p-5 sm:p-6 lg:p-7">
            <div class="flex items-center gap-3">
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {{ catTitle }}
              </h1>
              <span v-if="isLoading" class="badge badge-outline">در حال دریافت…</span>
              <span v-else-if="isError" class="badge badge-error">خطا</span>
            </div>

            <div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p
                  class="text-sm sm:text-base text-base-content/70 leading-relaxed
                       line-clamp-2 min-h-[40px] sm:min-h-[48px] sm:flex-1"
              >
                خرید مطمئن و سریع با تحویل آنی و پشتیبانی دائمی؛ انتخاب مناسب برای کاربران ایرانی.
              </p>

              <RouterLink
                  :to="heroCta.to"
                  class="btn btn-primary btn-sm rounded-2xl h-[40px] sm:h-[48px] px-5 shrink-0 sm:ms-6"
              >
                {{ heroCta.label }}
                <span class="text-base">←</span>
              </RouterLink>
            </div>

            <div class="mt-3 flex flex-wrap gap-2">
              <span class="badge badge-outline border-primary/30 text-primary">تحویل آنی</span>
              <span class="badge badge-outline border-primary/30 text-primary">قیمت به‌روز</span>
              <span class="badge badge-outline border-primary/30 text-primary">پشتیبانی ۲۴/۷</span>
            </div>

            <div v-if="isError" class="mt-4 text-sm text-error">
              دریافت محصولات با خطا مواجه شد. دوباره تلاش کنید.
              <button class="btn btn-ghost btn-sm ms-2" @click="loadProducts">تلاش مجدد</button>
            </div>
          </div>

          <div class="h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-80"></div>
        </div>
      </section>

      <!-- Products Panel -->
      <section class="rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-visible">
        <div class="flex items-center justify-between gap-3 border-b border-base-300 px-4 py-3 sm:px-5">
          <div class="min-w-0">
            <p class="text-xs uppercase tracking-widest text-base-content/50">جستجو و انتخاب</p>
            <div class="flex items-center gap-3">
              <h3 class="text-lg font-extrabold">{{ catTitle }}ی موجود</h3>
              <span class="hidden sm:inline h-1 w-10 rounded-full bg-primary/70"></span>
              <span class="hidden sm:inline text-sm text-base-content/60">({{ filtered.length }} محصول)</span>
            </div>
          </div>

        </div>

        <div class="p-4 sm:p-5 lg:p-6 space-y-4 min-w-0">
          <div class="tools-row">
            <div class="rounded-2xl border border-base-300 bg-base-100/70 p-3 backdrop-blur">
              <SortBar v-model="sort" :total="filtered.length" />
            </div>

            <div ref="filterWrap" class="relative">
              <button
                  ref="filterBtn"
                  type="button"
                  class="btn btn-primary btn-sm rounded-2xl"
                  @click.stop="toggleInlineFilters"
              >
                فیلترهای پیشرفته
                <span class="text-base">≡</span>
              </button>

              <Transition name="drop-panel">
                <div
                    v-if="filtersOpen"
                    ref="filterPanel"
                    class="filters-dropdown"
                    :class="[
                    dropdownSide === 'left' ? 'fd-left' : 'fd-right',
                    dropdownUp ? 'fd-up' : 'fd-down',
                  ]"
                    :style="filtersDropdownStyle"
                    @click.stop
                >
                  <div class="p-4 sm:p-5 space-y-3 bg-base-100">
                    <div class="rounded-3xl border border-base-300 bg-base-100 p-4">
                      <FiltersSidebar
                          v-model:onlyDigital="draftOnlyDigital"
                          v-model:onlyDiscount="draftOnlyDiscount"
                      />
                    </div>

                    <div class="grid gap-2 sm:grid-cols-2">
                      <button class="btn btn-ghost btn-sm rounded-2xl" @click="resetFilters">
                        پاک کردن
                      </button>
                      <button class="btn btn-primary btn-sm rounded-2xl" @click="applyFilters">
                        اعمال
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <div v-if="isLoading" class="text-sm text-base-content/60 py-6">
            در حال دریافت محصولات…
          </div>

          <div v-else class="products-grid">
            <!-- ✅ حالا product ها image/url درست دارند -->
            <ProductCard v-for="p in paged" :key="keyOf(p)" :product="p" class="product-card--main" />
          </div>

          <div v-if="!isLoading && !filtered.length" class="text-center text-sm text-base-content/60 py-10">
            محصولی برای نمایش وجود ندارد.
          </div>

          <div class="mt-4 flex justify-center" v-if="pages > 1">
            <Pagination :page="page" :pages="pages" @update:page="page = $event" />
          </div>
        </div>
      </section>

      <!-- Activation Guide -->
      <section class="rounded-3xl border border-base-300 bg-base-100 shadow-sm p-4 sm:p-6 space-y-4">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 class="text-lg font-extrabold">راهنمای فعال‌سازی</h3>
          </div>
        </div>

        <div class="rounded-2xl border border-base-300 bg-base-200/40 p-4 sm:p-5">
          <ul class="steps steps-vertical sm:steps-horizontal w-full">
            <li class="step step-primary">
              انتخاب محصول
              <span class="block text-[11px] text-base-content/60 mt-1">سرویس/اکانت موردنظر را انتخاب کنید</span>
            </li>
            <li class="step step-primary">
              پرداخت
              <span class="block text-[11px] text-base-content/60 mt-1">اطلاعات را بررسی و خرید را نهایی کنید</span>
            </li>
            <li class="step step-primary">
              دریافت کد/اطلاعات
              <span class="block text-[11px] text-base-content/60 mt-1">پس از پرداخت، مشخصات نمایش داده می‌شود</span>
            </li>
            <li class="step step-primary">
              فعال‌سازی
              <span class="block text-[11px] text-base-content/60 mt-1">طبق آموزش سرویس، کد را وارد و فعال کنید</span>
            </li>
            <li class="step">
              پشتیبانی
              <span class="block text-[11px] text-base-content/60 mt-1">در صورت خطا، سریع با پشتیبانی تماس بگیرید</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- Why -->
      <section class="rounded-3xl border border-base-300 bg-base-100 shadow-sm p-4 sm:p-6 space-y-5">
        <div class="space-y-2">
          <p class="text-xs font-extrabold text-primary">چرا ما؟</p>
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-extrabold">چرا {{ catTitle }} از میتراپی؟</h2>
            <span class="hidden sm:inline h-1 w-10 rounded-full bg-primary/70"></span>
          </div>
          <p class="text-sm text-base-content/70 leading-relaxed max-w-3xl">
            بیشترین تنوع موجودی، قیمت منصفانه و تحویل سریع باعث شده کاربران ایرانی برای خرید سرویس‌های محبوب سراغ ما بیایند.
          </p>
        </div>

        <ul class="grid gap-3 sm:grid-cols-2">
          <li class="why-card">
            <span class="why-ic">⚡</span>
            <div>
              <p class="why-title">تحویل آنی</p>
              <p class="why-copy">کد پس از پرداخت بلافاصله نمایش داده می‌شود.</p>
            </div>
          </li>

          <li class="why-card">
            <span class="why-ic">🧠</span>
            <div>
              <p class="why-title">پشتیبانی تخصصی</p>
              <p class="why-copy">راهنمایی فعال‌سازی و رفع خطاها به صورت ۲۴/۷.</p>
            </div>
          </li>
        </ul>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div class="tile">
            <div class="tile-ic">🔒</div>
            <div>
              <p class="tile-title">پرداخت امن</p>
              <p class="tile-copy">تسویه درگاه بانکی معتبر با رمز پویا.</p>
            </div>
          </div>

          <div class="tile">
            <div class="tile-ic">🌍</div>
            <div>
              <p class="tile-title">تنوع ریجن</p>
              <p class="tile-copy">گزینه‌های مختلف و راهنمای انتخاب مناسب.</p>
            </div>
          </div>

          <div class="tile">
            <div class="tile-ic">🏷️</div>
            <div>
              <p class="tile-title">قیمت رقابتی</p>
              <p class="tile-copy">قیمت‌ها به‌روز و همراه با تخفیف دوره‌ای.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="rounded-3xl border border-base-300 bg-base-100 shadow-sm p-4 sm:p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h3 class="text-lg font-extrabold">سؤالات متداول کاربران</h3>
          </div>
          <span class="badge badge-primary badge-outline">FAQ</span>
        </div>

        <div class="grid gap-3">
          <div class="collapse collapse-plus faqx">
            <input type="radio" name="faq" checked />
            <div class="collapse-title faqx-title">آیا کدها تاریخ انقضا دارند؟</div>
            <div class="collapse-content faqx-body">
              تمامی کدها معتبر هستند. پیشنهاد می‌شود پس از خرید سریعاً استفاده کنید.
            </div>
          </div>

          <div class="collapse collapse-plus faqx">
            <input type="radio" name="faq" />
            <div class="collapse-title faqx-title">در صورت خطا در ریجن چه کنم؟</div>
            <div class="collapse-content faqx-body">
              با پشتیبانی تماس بگیرید تا ریجن مناسب را انتخاب کنید یا راهنمای تغییر ریجن دریافت کنید.
            </div>
          </div>

          <div class="collapse collapse-plus faqx">
            <input type="radio" name="faq" />
            <div class="collapse-title faqx-title">آیا می‌توانم برای شخص دیگری هدیه بخرم؟</div>
            <div class="collapse-content faqx-body">
              بله، کافی است کد یا اطلاعات را برای فرد موردنظر ارسال کنید.
            </div>
          </div>
        </div>
      </section>

      <!-- Similar products -->
      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-widest text-base-content/50">محصولات مشابه</p>
            <div class="flex items-center gap-3">
              <h3 class="text-lg font-extrabold">گزینه‌های دیگری که ممکن است بپسندید</h3>
              <span class="hidden sm:inline h-1 w-10 rounded-full bg-primary/70"></span>
            </div>
          </div>
          <span class="text-xs text-base-content/60">نمایش {{ similarProducts.length }} مورد</span>
        </div>

        <div class="similar-row-shell">
          <button
              type="button"
              class="similar-nav"
              :disabled="simLock || similarProducts.length <= similarWindow"
              @click="similarPrev"
              aria-label="قبلی"
          >
            ‹
          </button>

          <TransitionGroup
              tag="div"
              name="sim-swap"
              class="similar-row"
              :class="simDir === 'next' ? 'dir-next' : 'dir-prev'"
              :style="{ '--sim-cols': String(similarWindow) }"
          >
            <div
                v-for="(p, i) in visibleSimilar"
                :key="`${keyOf(p)}__slot_${i}`"
                class="similar-item"
            >
              <div class="product-card--similar">
                <ProductCard :product="p" />
              </div>
            </div>
          </TransitionGroup>

          <button
              type="button"
              class="similar-nav"
              :disabled="simLock || similarProducts.length <= similarWindow"
              @click="similarNext"
              aria-label="بعدی"
          >
            ›
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import FiltersSidebar from '@/components/FiltersSidebar.vue'
import SortBar from '@/components/SortBar.vue'
import Pagination from '@/components/Pagination.vue'
import ProductCard from '@/components/ProductCard.vue'

import { listProducts } from '@/services/products'

const route = useRoute()

const sort = ref('bestselling')

const appliedOnlyDigital = ref(false)
const appliedOnlyDiscount = ref(false)

const draftOnlyDigital = ref(false)
const draftOnlyDiscount = ref(false)

const page = ref(1)
const perPage = 12

const filtersOpen = ref(false)

const filterWrap = ref<HTMLElement | null>(null)
const filterBtn = ref<HTMLElement | null>(null)
const filterPanel = ref<HTMLElement | null>(null)

const dropdownSide = ref<'right' | 'left'>('right')
const dropdownUp = ref(false)
const filtersDropdownStyle = ref<Record<string, string>>({})

const allProducts = ref<any[]>([])
const isLoading = ref(false)
const isError = ref(false)

/** =========================
 * ✅ Image normalization (SAFE)
 * ========================= */
const ASSET_BASE =
    (import.meta as any).env?.VITE_ASSET_BASE_URL ||
    (import.meta as any).env?.VITE_FILES_BASE_URL ||
    (import.meta as any).env?.VITE_API_BASE_URL ||
    (import.meta as any).env?.VITE_API_URL ||
    ''

const PLACEHOLDER = 'https://placehold.co/1200x700'

function isLikelyImagePath(s: string) {
  return s.includes('/') || /\.(png|jpe?g|webp|gif|svg|avif)$/i.test(s)
}

function normalizeImageUrl(u?: string | null) {
  const s = String(u ?? '').trim()
  if (!s) return ''

  if (/^https?:\/\//i.test(s)) return s
  if (s.startsWith('//')) return `https:${s}`

  if (s.startsWith('/')) return s

  if (!isLikelyImagePath(s)) return ''

  const base = String(ASSET_BASE || '').trim().replace(/\/+$/, '')
  if (!base) return ''
  return `${base}/${s.replace(/^\/+/, '')}`
}

function normalizeListProduct(p: any) {
  const rawMain =
      p?.image_url ??
      p?.image ??
      p?.imageUrl ??
      p?.thumbnail ??
      p?.thumb ??
      p?.cover ??
      p?.cover_url ??
      p?.image_path ??
      p?.imagePath

  const main = normalizeImageUrl(rawMain)

  const gallery = Array.isArray(p?.images)
      ? p.images.map((x: any) => normalizeImageUrl(x)).filter(Boolean)
      : Array.isArray(p?.gallery)
          ? p.gallery.map((x: any) => normalizeImageUrl(x)).filter(Boolean)
          : main
              ? [main]
              : []

  return {
    ...p,
    image: main || PLACEHOLDER,
    image_url: main || PLACEHOLDER,
    images: gallery.length ? gallery : [main || PLACEHOLDER],
  }
}

/** =========================
 * ✅ Category mapping
 * ========================= */
type CategorySlug = 'account' | 'gift-card' | 'services'
type PageSlug = 'accounts' | 'gift-cards'

function normalize(v: any) {
  return String(v ?? '').trim().toLowerCase()
}

function getCategorySlug(p: any): CategorySlug | null {
  const cid = Number(p?.category_id ?? p?.categoryId ?? NaN)
  if (cid === 1) return 'account'
  if (cid === 2) return 'gift-card'
  if (cid === 3) return 'services'

  const slug = normalize(p?.category_slug ?? p?.categorySlug ?? p?.category?.slug)
  if (slug === 'account') return 'account'
  if (slug === 'gift-card' || slug === 'giftcard' || slug === 'gift_card') return 'gift-card'
  if (slug === 'services' || slug === 'service') return 'services'
  return null
}

function keyOf(p: any) {
  return String(p?.id ?? p?._id ?? p?.sku ?? p?.slug ?? p?.code ?? JSON.stringify(p))
}

/** =========================
 * ✅ Discount + Digital helpers (همون منطق کارت)
 * ========================= */
function toNumber(v: any): number {
  if (v === null || v === undefined) return 0
  const s = String(v).trim()
  if (!s) return 0
  const cleaned = s.replace(/[^0-9.\-]/g, '')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

function priceA(p: any) {
  return toNumber(p?.price ?? 0)
}

// ✅ بک‌اند شما compare_at_price دارد
function priceB(p: any) {
  return toNumber(
      p?.compareAt ??
      p?.compare_at_price ??
      p?.compare_at ??
      p?.compare_at_price ??
      p?.old_price ??
      0
  )
}

function hasDiscountProduct(p: any) {
  const a = priceA(p)
  const b = priceB(p)
  if (a <= 0 || b <= 0) return false
  const original = Math.max(a, b)
  const final = Math.min(a, b)
  return original > final
}

function finalPriceOf(p: any) {
  const a = priceA(p)
  const b = priceB(p)
  if (a > 0 && b > 0) return Math.min(a, b) // قیمت نهایی (تخفیف‌دار)
  return a || b || 0
}

function isDigitalProduct(p: any) {
  const dt = String(p?.delivery_type ?? '').toLowerCase()
  if (dt === 'digital') return true
  // طبق دیتای شما stock معمولاً null است (دیجیتال‌ها)
  if (p?.stock === null) return true
  return false
}

/** =========================
 * ✅ Fetch products
 * ========================= */
async function loadProducts() {
  isLoading.value = true
  isError.value = false

  try {
    const data: any = await listProducts()
    const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []

    const normalizedItems = items.map((p: any) => normalizeListProduct(p))

    // خدمات حذف
    allProducts.value = normalizedItems.filter((p: any) => getCategorySlug(p) !== 'services')
  } catch (e) {
    console.error('listProducts error:', e)
    isError.value = true
    allProducts.value = []
  } finally {
    isLoading.value = false
  }
}

/** =========================
 * ✅ Grouped lists
 * ========================= */
const accountsProducts = computed(() => allProducts.value.filter((p) => getCategorySlug(p) === 'account'))
const giftCardsProducts = computed(() => allProducts.value.filter((p) => getCategorySlug(p) === 'gift-card'))

const currentSlug = computed(() => String(route.params.slug ?? '') as PageSlug | string)

const catTitle = computed(() => {
  if (currentSlug.value === 'accounts') return 'اکانت‌ها'
  if (currentSlug.value === 'gift-cards') return 'گیفت‌کارت‌ها'
  return 'محصولات'
})

const heroCta = computed(() => {
  if (currentSlug.value === 'accounts') return { label: 'مشاهده گیفت‌کارت‌ها', to: '/category/gift-cards' }
  if (currentSlug.value === 'gift-cards') return { label: 'مشاهده اکانت‌ها', to: '/category/accounts' }
  return { label: 'مشاهده گیفت‌کارت‌ها', to: '/category/gift-cards' }
})

const currentProducts = computed(() => {
  if (currentSlug.value === 'accounts') return accountsProducts.value
  if (currentSlug.value === 'gift-cards') return giftCardsProducts.value
  return [...accountsProducts.value, ...giftCardsProducts.value]
})

/** =========================
 * ✅ Filters + Sort (FIXED)
 * ========================= */
const filtered = computed(() => {
  let items = currentProducts.value.slice()

  // ✅ فیلتر دیجیتال (متصل به منطق کارت)
  if (appliedOnlyDigital.value) {
    items = items.filter((p: any) => isDigitalProduct(p))
  }

  // ✅ فیلتر تخفیف (متصل به منطق کارت)
  if (appliedOnlyDiscount.value) {
    items = items.filter((p: any) => hasDiscountProduct(p))
  }

  // ✅ مرتب‌سازی درست بر اساس قیمت نهایی
  if (sort.value === 'price-asc') {
    items.sort((a: any, b: any) => finalPriceOf(a) - finalPriceOf(b))
  }
  if (sort.value === 'price-desc') {
    items.sort((a: any, b: any) => finalPriceOf(b) - finalPriceOf(a))
  }

  // bestselling => تغییری نمی‌ده (همون ترتیب بک‌اند)
  return items
})

const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)))
const paged = computed(() => {
  const start = (page.value - 1) * perPage
  return filtered.value.slice(start, start + perPage)
})

watch([sort, appliedOnlyDigital, appliedOnlyDiscount], () => {
  page.value = 1
})

/** =========================
 * ✅ Similar products
 * ========================= */
const similarIndex = ref(0)
const similarWindow = ref(5)
const simDir = ref<'next' | 'prev'>('next')

const simLock = ref(false)
const SIM_ANIM_MS = 280
function lockSimilar() {
  simLock.value = true
  window.setTimeout(() => (simLock.value = false), SIM_ANIM_MS)
}

const similarProducts = computed(() => {
  if (currentSlug.value === 'accounts') return giftCardsProducts.value
  if (currentSlug.value === 'gift-cards') return accountsProducts.value
  return [...giftCardsProducts.value, ...accountsProducts.value]
})

const visibleSimilar = computed(() => {
  const start = similarIndex.value
  const end = start + similarWindow.value
  return similarProducts.value.slice(start, end)
})

function measureSimilarWindow() {
  const w = window.innerWidth
  if (w < 640) similarWindow.value = 1
  else if (w < 768) similarWindow.value = 2
  else if (w < 1024) similarWindow.value = 3
  else if (w < 1280) similarWindow.value = 4
  else similarWindow.value = 5

  const maxStart = Math.max(0, similarProducts.value.length - similarWindow.value)
  similarIndex.value = Math.min(similarIndex.value, maxStart)
}

function similarPrev() {
  if (simLock.value) return
  if (similarProducts.value.length <= similarWindow.value) return
  lockSimilar()

  simDir.value = 'prev'
  const maxStart = Math.max(0, similarProducts.value.length - similarWindow.value)
  similarIndex.value = similarIndex.value <= 0 ? maxStart : Math.max(0, similarIndex.value - 1)
}
function similarNext() {
  if (simLock.value) return
  if (similarProducts.value.length <= similarWindow.value) return
  lockSimilar()

  simDir.value = 'next'
  const maxStart = Math.max(0, similarProducts.value.length - similarWindow.value)
  similarIndex.value = similarIndex.value >= maxStart ? 0 : Math.min(maxStart, similarIndex.value + 1)
}

watch(
    () => similarProducts.value.length,
    async () => {
      await nextTick()
      measureSimilarWindow()
      const maxStart = Math.max(0, similarProducts.value.length - similarWindow.value)
      similarIndex.value = Math.min(similarIndex.value, maxStart)
    }
)

/** =========================
 * Filters dropdown
 * ========================= */
function positionFiltersDropdown() {
  if (!filterBtn.value || !filterPanel.value) return

  const btnRect = filterBtn.value.getBoundingClientRect()
  const panelEl = filterPanel.value

  const vw = window.innerWidth
  const vh = window.innerHeight
  const margin = 8
  const gap = 10

  const panelW = panelEl.offsetWidth
  const panelH = panelEl.offsetHeight

  let left = btnRect.right - panelW
  let side: 'right' | 'left' = 'right'

  if (left < margin) {
    left = btnRect.left
    side = 'left'
  }
  left = Math.max(margin, Math.min(left, vw - panelW - margin))

  let top = btnRect.bottom + gap
  let up = false
  if (top + panelH > vh - margin && btnRect.top - gap - panelH > margin) {
    top = btnRect.top - gap - panelH
    up = true
  } else {
    top = Math.max(margin, Math.min(top, vh - panelH - margin))
  }

  dropdownSide.value = side
  dropdownUp.value = up
  filtersDropdownStyle.value = { left: `${left}px`, top: `${top}px` }
}

function toggleInlineFilters() {
  if (!filtersOpen.value) {
    draftOnlyDigital.value = appliedOnlyDigital.value
    draftOnlyDiscount.value = appliedOnlyDiscount.value
  }
  filtersOpen.value = !filtersOpen.value
}

function resetFilters() {
  draftOnlyDigital.value = false
  draftOnlyDiscount.value = false
  appliedOnlyDigital.value = false
  appliedOnlyDiscount.value = false
  page.value = 1
}

function applyFilters() {
  appliedOnlyDigital.value = draftOnlyDigital.value
  appliedOnlyDiscount.value = draftOnlyDiscount.value
  page.value = 1
  filtersOpen.value = false
}

function onDocClick(e: MouseEvent) {
  if (!filtersOpen.value) return
  const t = e.target as Node
  if (filterWrap.value && !filterWrap.value.contains(t)) filtersOpen.value = false
}
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') filtersOpen.value = false
}
function onViewportChange() {
  if (!filtersOpen.value) return
  positionFiltersDropdown()
}

watch(filtersOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    positionFiltersDropdown()
    window.addEventListener('resize', onViewportChange, { passive: true })
    window.addEventListener('scroll', onViewportChange, true)
  } else {
    window.removeEventListener('resize', onViewportChange as any)
    window.removeEventListener('scroll', onViewportChange as any, true)
  }
})

watch(
    () => route.params.slug,
    async () => {
      page.value = 1
      filtersOpen.value = false
      similarIndex.value = 0
      simDir.value = 'next'
      await nextTick()
      measureSimilarWindow()
    }
)

/** =========================
 * lifecycle
 * ========================= */
onMounted(async () => {
  await loadProducts()

  document.addEventListener('click', onDocClick)
  window.addEventListener('keydown', onKeyDown)

  measureSimilarWindow()
  window.addEventListener('resize', measureSimilarWindow, { passive: true })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  window.removeEventListener('keydown', onKeyDown)

  window.removeEventListener('resize', onViewportChange as any)
  window.removeEventListener('scroll', onViewportChange as any, true)

  window.removeEventListener('resize', measureSimilarWindow as any)
})
</script>

<style scoped>
/* همون استایل‌های خودت — بدون تغییر */
.category-page { direction: rtl; }

.category-page {
  background:
      radial-gradient(800px 500px at 20% 0%, rgba(255, 255, 255, 0.10), transparent 60%),
      radial-gradient(900px 650px at 80% 20%, rgba(255, 255, 255, 0.08), transparent 65%);
}

/* Toolbar */
.tools-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
@media (max-width: 640px) {
  .tools-row { flex-direction: column; align-items: stretch; }
}

/* Dropdown transition */
.drop-panel-enter-active,
.drop-panel-leave-active { transition: opacity 160ms ease, transform 160ms ease; }
.drop-panel-enter-from,
.drop-panel-leave-to { opacity: 0; transform: translateY(-8px); }

/* Dropdown */
.filters-dropdown {
  position: fixed;
  z-index: 9999;
  width: min(520px, calc(100vw - 16px));
  border-radius: 24px;
  border: 1px solid hsl(var(--b3));
  background: hsl(var(--b1));
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  backdrop-filter: none;
}
.filters-dropdown.fd-right { transform-origin: top right; }
.filters-dropdown.fd-left { transform-origin: top left; }
.filters-dropdown.fd-up { transform-origin: bottom center; }

/* Products grid */
.products-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
@media (min-width: 640px) { .products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 768px) { .products-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .products-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }

/* Main product cards */
:deep(.product-card--main .card) { border-radius: 26px; }
:deep(.product-card--main .card-body) { padding: 14px !important; }
:deep(.product-card--main .card-title) {
  font-size: 15px !important;
  line-height: 1.3 !important;
  font-weight: 950 !important;
}
:deep(.product-card--main .badge) { font-size: 11.5px !important; padding: 3px 10px !important; }
:deep(.product-card--main figure) { overflow: hidden; max-height: 220px; }
:deep(.product-card--main figure img) { height: 220px; width: 100%; object-fit: cover; }
:deep(.product-card--main .btn) { border-radius: 16px !important; }
:deep(.product-card--main .btn.btn-sm),
:deep(.product-card--main .btn-sm) {
  height: 40px !important;
  min-height: 40px !important;
  font-size: 12.5px !important;
  padding: 0 14px !important;
}

/* =========================
   Similar (one row slider)
   ========================= */
.similar-row-shell {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  gap: 10px;
  align-items: center;
}

.similar-row {
  --sim-cols: 5;
  --sim-gap: 12px;

  /* ✅ برگردوندن به ابعاد نرمال (پیشفرض) */
  --sim-card-h: 330px;
  --sim-img-h: 155px;

  display: grid;
  grid-template-columns: repeat(var(--sim-cols), minmax(0, 1fr));
  gap: var(--sim-gap);

  overflow: hidden;
  border-radius: 22px;

  height: var(--sim-card-h);
  align-items: stretch;
  min-width: 0;
  contain: layout paint;
}

@media (max-width: 640px) {
  .similar-row { --sim-card-h: 310px; --sim-img-h: 150px; }
}
@media (min-width: 1024px) {
  .similar-row { --sim-card-h: 340px; --sim-img-h: 160px; }
}

.similar-item {
  min-width: 0;
  height: 100%;
  overflow: hidden;
  border-radius: 22px;
  will-change: transform, opacity;
}

/* nav buttons */
.similar-nav {
  height: 44px;
  width: 40px;
  border-radius: 14px;
  border: 1px solid hsl(var(--b3));
  background: hsl(var(--b1));
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
  display: grid;
  place-items: center;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: transform 140ms ease, opacity 140ms ease;
}
.similar-nav:hover { transform: translateY(-1px); }
.similar-nav:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

@media (max-width: 640px) {
  .similar-row-shell { grid-template-columns: 36px 1fr 36px; }
  .similar-nav { width: 36px; border-radius: 12px; }
}

/* TransitionGroup */
.sim-swap-move { transition: transform 280ms ease; }
.sim-swap-enter-active { transition: transform 280ms ease, opacity 200ms ease; }
.sim-swap-leave-active { transition: transform 240ms ease, opacity 170ms ease; }

.dir-next .sim-swap-enter-from { opacity: 0; transform: translateX(14px); }
.dir-next .sim-swap-leave-to   { opacity: 0; transform: translateX(-14px); }

.dir-prev .sim-swap-enter-from { opacity: 0; transform: translateX(-14px); }
.dir-prev .sim-swap-leave-to   { opacity: 0; transform: translateX(14px); }

/* =========================
   ✅ Similar FIX (قفل ابعاد و جلوگیری از دفرمه)
   فقط روی Similar اعمال می‌شود
   ========================= */

/* wrapper ای که خودت گذاشتی */
.product-card--similar { height: 100%; min-width: 0; }
.product-card--similar :deep(.card) {
  height: 100% !important;
  max-height: 100% !important;
  width: 100% !important;
  overflow: hidden !important;
  border-radius: 22px;
}

/* ظرف تصویر: ارتفاع ثابت */
.product-card--similar :deep(figure),
.product-card--similar :deep(.card figure),
.product-card--similar :deep(.card > figure) {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;

  height: var(--sim-img-h) !important;
  min-height: var(--sim-img-h) !important;
  max-height: var(--sim-img-h) !important;

  overflow: hidden !important;
  position: relative !important;
  line-height: 0 !important;

  flex: 0 0 auto !important;
  border-radius: 18px !important;
}

/* wrapper های رایج داخل figure */
.product-card--similar :deep(figure > div),
.product-card--similar :deep(figure > picture),
.product-card--similar :deep(figure > a) {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  overflow: hidden !important;
}

/* ✅ badge تخفیف کش نیاد */
.product-card--similar :deep(figure > span.absolute) {
  width: auto !important;
  height: auto !important;
  display: inline-flex !important;
}

/* تصویر: فیت کامل */
.product-card--similar :deep(img),
.product-card--similar :deep(figure img),
.product-card--similar :deep(.card figure img) {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  object-fit: cover !important;
  object-position: center !important;
}

/* بدنه کارت: نذار بزرگ شه */
.product-card--similar :deep(.card-body) {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  padding: 12px !important;
}

/* عنوان: دو خطه (نذار کارت کش بیاد) */
.product-card--similar :deep(.card-title) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 1.25 !important;
  min-height: calc(1.25em * 2);
}
.category-page { direction: rtl; }

.category-page {
  background:
      radial-gradient(800px 500px at 20% 0%, rgba(255, 255, 255, 0.10), transparent 60%),
      radial-gradient(900px 650px at 80% 20%, rgba(255, 255, 255, 0.08), transparent 65%);
}

/* Toolbar */
.tools-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
@media (max-width: 640px) {
  .tools-row { flex-direction: column; align-items: stretch; }
}

/* Dropdown transition */
.drop-panel-enter-active,
.drop-panel-leave-active { transition: opacity 160ms ease, transform 160ms ease; }
.drop-panel-enter-from,
.drop-panel-leave-to { opacity: 0; transform: translateY(-8px); }

/* Dropdown */
.filters-dropdown {
  position: fixed;
  z-index: 9999;
  width: min(520px, calc(100vw - 16px));
  border-radius: 24px;
  border: 1px solid hsl(var(--b3));
  background: hsl(var(--b1));
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  backdrop-filter: none;
}
.filters-dropdown.fd-right { transform-origin: top right; }
.filters-dropdown.fd-left { transform-origin: top left; }
.filters-dropdown.fd-up { transform-origin: bottom center; }

/* Products grid */
.products-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
@media (min-width: 640px) { .products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 768px) { .products-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .products-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }

/* =========================
   Similar (one row slider)
   ========================= */
.similar-row-shell {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  gap: 10px;
  align-items: center;
}

.similar-row {
  --sim-cols: 5;
  --sim-gap: 12px;

  --sim-card-h: 330px;
  --sim-img-h: 155px;

  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--sim-cols), minmax(0, 1fr));
  gap: var(--sim-gap);

  overflow: hidden;
  border-radius: 22px;

  height: var(--sim-card-h);
  align-items: stretch;
  min-width: 0;

  contain: layout paint;
}
@media (max-width: 640px) {
  .similar-row { --sim-card-h: 310px; --sim-img-h: 150px; }
}
@media (min-width: 1024px) {
  .similar-row { --sim-card-h: 340px; --sim-img-h: 160px; }
}

.similar-item {
  min-width: 0;
  height: 100%;
  overflow: hidden;
  border-radius: 22px;
  will-change: transform, opacity;
}

.sim-swap-leave-active {
  position: absolute;
  top: 0;
  height: 100%;
  width: calc((100% - (var(--sim-cols) - 1) * var(--sim-gap)) / var(--sim-cols));
}

/* nav buttons */
.similar-nav {
  height: 44px;
  width: 40px;
  border-radius: 14px;
  border: 1px solid hsl(var(--b3));
  background: hsl(var(--b1));
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
  display: grid;
  place-items: center;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: transform 140ms ease, opacity 140ms ease;
}
.similar-nav:hover { transform: translateY(-1px); }
.similar-nav:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}
@media (max-width: 640px) {
  .similar-row-shell { grid-template-columns: 36px 1fr 36px; }
  .similar-nav { width: 36px; border-radius: 12px; }
}

/* TransitionGroup */
.sim-swap-move { transition: transform 280ms ease; }
.sim-swap-enter-active { transition: transform 280ms ease, opacity 200ms ease; }
.sim-swap-leave-active { transition: transform 240ms ease, opacity 170ms ease; }

.dir-next .sim-swap-enter-from { opacity: 0; transform: translateX(14px); }
.dir-next .sim-swap-leave-to   { opacity: 0; transform: translateX(-14px); }

.dir-prev .sim-swap-enter-from { opacity: 0; transform: translateX(-14px); }
.dir-prev .sim-swap-leave-to   { opacity: 0; transform: translateX(14px); }

/* =========================
   ✅ Similar FIX (Scoped to Similar فقط)
   ========================= */
.similar-row-shell :deep(.product-card--similar),
.similar-row-shell :deep(.product-card--similar .card) {
  height: 100%;
  overflow: hidden;
  border-radius: 22px;
}

/* ظرف تصویر: ارتفاع ثابت + کلیپ */
.similar-row-shell :deep(.product-card--similar figure),
.similar-row-shell :deep(.product-card--similar .card figure),
.similar-row-shell :deep(.product-card--similar .card > figure) {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;

  height: var(--sim-img-h) !important;
  min-height: var(--sim-img-h) !important;
  max-height: var(--sim-img-h) !important;

  overflow: hidden !important;
  position: relative !important;
  line-height: 0 !important;

  flex: 0 0 auto !important;
  border-radius: 18px !important;
}

/* ✅ wrapper های رایج (بدون span چون span = badge تخفیف) */
.similar-row-shell :deep(.product-card--similar figure > div),
.similar-row-shell :deep(.product-card--similar figure > picture),
.similar-row-shell :deep(.product-card--similar figure > a) {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  overflow: hidden !important;
}

/* ✅ خود badge تخفیف: به هیچ وجه کش نیاد */
.similar-row-shell :deep(.product-card--similar figure > span.absolute) {
  width: auto !important;
  height: auto !important;
  display: inline-flex !important;
}

/* تصویر: کامل فیت و بدون بیرون‌زدگی */
.similar-row-shell :deep(.product-card--similar img),
.similar-row-shell :deep(.product-card--similar figure img),
.similar-row-shell :deep(.product-card--similar .card figure img) {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  object-fit: cover !important;
  object-position: center !important;
}

/* اگر تصویر مستقیم داخل کارت بود */
.similar-row-shell :deep(.product-card--similar .card > img) {
  width: 100% !important;
  height: var(--sim-img-h) !important;
  object-fit: cover !important;
  object-position: center !important;
  border-radius: 18px !important;
  overflow: hidden !important;
}

/* بدنه کارت: سالم */
.similar-row-shell :deep(.product-card--similar .card-body) {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 12px !important;
}

/* عنوان دو خطه */
.similar-row-shell :deep(.product-card--similar .card-title) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 1.25 !important;
  min-height: calc(1.25em * 2);
}

.similar-row-shell :deep(.product-card--similar .card-actions) { margin-top: auto; }

/* فوکوس لینک فقط داخل پیشنهادات */
.similar-row-shell :deep(a:focus),
.similar-row-shell :deep(a:focus-visible) {
  outline: none !important;
}

/* Why / tiles / faq (unchanged) */
.why-card { @apply flex gap-3 rounded-3xl border border-base-300 bg-base-100 p-4 shadow-sm hover:shadow-md transition; }
.why-ic { @apply flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary; }
.why-title { @apply text-sm font-extrabold; }
.why-copy { @apply text-xs text-base-content/70 mt-0.5; }

.tile { @apply flex gap-3 rounded-3xl border border-base-300 bg-base-100 p-4 shadow-sm hover:shadow-md transition; }
.tile-ic { @apply flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/10 text-secondary; }
.tile-title { @apply text-sm font-extrabold; }
.tile-copy { @apply text-xs text-base-content/70 mt-0.5; }

.faqx { @apply border border-base-300 bg-base-100 rounded-3xl overflow-hidden shadow-sm; }
.faqx:hover { @apply shadow-md; }
.faqx-title { @apply text-sm font-extrabold; }
.faqx-body { @apply text-sm text-base-content/70 leading-relaxed; }

/* Main product cards */
:deep(.product-card--main .card) { border-radius: 26px; }
:deep(.product-card--main .card-body) { padding: 14px !important; }
:deep(.product-card--main .card-title) {
  font-size: 15px !important;
  line-height: 1.3 !important;
  font-weight: 950 !important;
}
:deep(.product-card--main .badge) { font-size: 11.5px !important; padding: 3px 10px !important; }
:deep(.product-card--main figure) { overflow: hidden; max-height: 220px; }
:deep(.product-card--main figure img) { height: 220px; width: 100%; object-fit: cover; }
:deep(.product-card--main .btn) { border-radius: 16px !important; }
:deep(.product-card--main .btn.btn-sm),
:deep(.product-card--main .btn-sm) {
  height: 40px !important;
  min-height: 40px !important;
  font-size: 12.5px !important;
  padding: 0 14px !important;
}
/* دکمه‌ها پایین کارت */
.product-card--similar :deep(.card-actions) { margin-top: auto !important; }
</style>
