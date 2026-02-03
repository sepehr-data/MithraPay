<template>
  <div class="bg-base-200/80 min-h-screen">
    <main class="max-w-6xl mx-auto px-4 lg:px-0 py-8 space-y-12">

      <!-- HERO -->
      <HeroAppleOneBanner />

      <!-- 4 BANNERS (2x2) -->
      <section aria-label="ویژگی ها" class="grid gap-4 sm:grid-cols-2 justify-items-center">
        <RouterLink
            v-for="banner in banners"
            :key="banner.id"
            :to="banner.to"
            class="group relative block w-full max-w-[550px] h-64 sm:h-72 lg:h-80 overflow-hidden rounded-[26px] bg-gradient-to-br from-base-100 to-base-100/80 shadow-sm ring-1 ring-base-300/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <img :src="banner.image" :alt="banner.alt" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-60"></div>
        </RouterLink>
      </section>

      <!-- BANNER SLIDER (AUTOPLAY + SMOOTH FADE) -->
      <section aria-label="بنر اصلی" class="relative">
        <div class="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-base-100 to-base-100/60 border border-base-300/70 shadow-lg">
          <RouterLink :to="slides[current].to" class="block relative overflow-hidden">
            <Transition name="slider-horizontal">
              <img
                  :key="slides[current].id"
                  :src="slides[current].image"
                  :alt="slides[current].alt"
                  class="w-full h-[240px] md:h-[460px] object-cover block"
              />
            </Transition>
          </RouterLink>

          <!-- arrows -->
          <button
              class="absolute top-1/2 -translate-y-1/2 right-4 md:right-6 w-9 h-9 md:w-10 md:h-10 rounded-full bg-base-100/80 backdrop-blur-md shadow-lg flex items-center justify-center text-lg text-base-content/80 border border-base-300/70 transition transform hover:scale-110 hover:bg-primary hover:text-primary-content hover:border-primary/60"
              @click="prev"
          >
            ‹
          </button>
          <button
              class="absolute top-1/2 -translate-y-1/2 left-4 md:left-6 w-9 h-9 md:w-10 md:h-10 rounded-full bg-base-100/80 backdrop-blur-md shadow-lg flex items-center justify-center text-lg text-base-content/80 border border-base-300/70 transition transform hover:scale-110 hover:bg-primary hover:text-primary-content hover:border-primary/60"
              @click="next()"
          >
            ›
          </button>

          <!-- dots -->
          <div class="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5">
            <button
                v-for="(s, idx) in slides"
                :key="s.id"
                class="h-2.5 rounded-full transition-all duration-200 border border-base-300/70"
                :class="idx === current ? 'w-7 bg-primary shadow-md' : 'w-2.5 bg-base-100/80 hover:bg-primary/70'"
                @click="go(idx)"
            ></button>
          </div>
        </div>
      </section>

      <!-- TOP PRODUCTS -->
      <section aria-labelledby="top-products" class="space-y-5">
        <header class="flex items-center justify-between gap-4">
          <div class="space-y-1">
            <p class="text-xs text-primary font-semibold">منتخب ویژه</p>
            <div class="flex items-center gap-3">
              <h2 id="top-products" class="text-2xl font-bold">پرفروش‌های این هفته</h2>
              <span class="h-1 w-10 rounded-full bg-primary/70 hidden sm:inline-block"></span>
            </div>
            <p class="text-sm text-base-content/60">محبوب‌ترین اشتراک‌ها و اکانت‌ها</p>
          </div>
          <RouterLink to="/category/accounts" class="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1">
            مشاهده همه
            <span class="text-base">←</span>
          </RouterLink>
        </header>

        <div class="rounded-[24px] bg-base-100/80 shadow-sm ring-1 ring-base-300/70 px-3 sm:px-4 py-4">
          <div v-if="topWeeklyLoading" class="text-center py-8 text-sm text-base-content/60">
            در حال بارگذاری پرفروش‌ها...
          </div>
          <div v-else-if="topWeeklyError" class="text-center py-8 text-error text-sm">
            {{ topWeeklyError }}
          </div>
          <div v-else-if="!topWeeklyProducts.length" class="text-center py-8 text-sm text-base-content/60">
            در حال حاضر محصول پرفروشی ثبت نشده است.
          </div>
          <ProductCarousel v-else :products="topWeeklyProducts" />
        </div>
      </section>

      <!-- GIFT CARDS -->
      <section aria-labelledby="gift-cards" class="space-y-5">
        <header class="flex items-center justify-between gap-4">
          <div class="space-y-1">
            <p class="text-xs text-primary font-semibold">گیفت کارت‌های برگزیده</p>
            <div class="flex items-center gap-3">
              <h2 id="gift-cards" class="text-2xl font-bold">پرفروش‌ترین گیفت کارت‌ها</h2>
              <span class="h-1 w-10 rounded-full bg-primary/70 hidden sm:inline-block"></span>
            </div>
            <p class="text-sm text-base-content/60">گیفت کارت‌های اپل، پلی‌استیشن، استیم و سرویس‌های محبوب</p>
          </div>
          <RouterLink to="/category/gift-cards" class="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1">
            مشاهده همه گیفت‌کارت‌ها
            <span class="text-base">←</span>
          </RouterLink>
        </header>

        <div class="rounded-[24px] bg-base-100/80 shadow-sm ring-1 ring-base-300/70 px-3 sm:px-4 py-4">
          <div v-if="giftCardsLoading" class="text-center py-8 text-sm text-base-content/60">
            در حال بارگذاری گیفت کارت‌ها...
          </div>
          <div v-else-if="giftCardsError" class="text-center py-8 text-error text-sm">
            {{ giftCardsError }}
          </div>
          <div v-else-if="!giftCards.length" class="text-center py-8 text-sm text-base-content/60">
            گیفت کارتی برای نمایش وجود ندارد.
          </div>
          <div v-else dir="rtl">
            <ProductCarousel :products="giftCards" />
          </div>
        </div>
      </section>

      <!-- USER REVIEWS -->
      <section aria-labelledby="reviews" class="space-y-6">
        <div class="flex flex-col items-center text-center gap-2">
          <p class="text-xs text-primary font-semibold">نظر کاربران</p>
          <h2 id="reviews" class="text-2xl font-bold">تجربه مشتریان میتراپی</h2>
          <p class="text-sm text-base-content/60">چند بازخورد واقعی کاربران</p>
          <div class="w-16 h-1 bg-primary/70 rounded-full"></div>
        </div>

        <div class="grid gap-5 md:grid-cols-3">
          <article
              v-for="r in reviews"
              :key="r.id"
              class="bg-base-100 rounded-2xl shadow-sm ring-1 ring-base-300/70 p-5 flex flex-col gap-3"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {{ r.initials }}
              </div>
              <div>
                <p class="text-sm font-semibold">{{ r.name }}</p>
                <p class="text-[11px] text-base-content/60">{{ r.meta }}</p>
              </div>
            </div>
            <p class="text-sm text-base-content/80 leading-relaxed line-clamp-4">
              {{ r.text }}
            </p>
            <div class="mt-auto flex items-center justify-between pt-2 text-xs">
              <div class="flex items-center gap-1 text-amber-400">
                <span v-for="n in 5" :key="n">
                  <span v-if="n <= r.stars">★</span>
                  <span v-else class="text-base-content/20">★</span>
                </span>
              </div>
              <span class="text-base-content/60">{{ r.date }}</span>
            </div>
          </article>
        </div>
      </section>

      <!-- BLOG -->
      <section aria-labelledby="blog" class="space-y-6">
        <div class="flex flex-col items-center text-center gap-2">
          <p class="text-xs text-primary font-semibold">وبلاگ پلاس</p>
          <h2 id="blog" class="text-2xl font-bold">آخرین مطالب بلاگ</h2>
          <p class="text-sm text-base-content/60">آموزش‌ها، نکته‌ها و خبرهای دنیای دیجیتال</p>
          <div class="w-16 h-1 bg-primary/70 rounded-full"></div>
        </div>

        <div class="rounded-[24px] bg-base-100/80 shadow-sm ring-1 ring-base-300/70 p-4">
          <div v-if="blogLoading" class="text-center py-6 text-sm text-base-content/60">
            در حال بارگذاری مطالب...
          </div>
          <div v-else-if="blogError" class="text-center py-6 text-error text-sm">
            {{ blogError }}
          </div>
          <div v-else-if="!blogPosts.length" class="text-center py-6 text-sm text-base-content/60">
            مطلبی برای نمایش وجود ندارد.
          </div>

          <div v-else class="grid gap-5 md:grid-cols-3">
            <article
                v-for="post in blogPosts"
                :key="post.slug"
                class="group relative bg-base-100 rounded-2xl overflow-hidden shadow-sm ring-1 ring-base-300/60 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div class="h-44 overflow-hidden bg-base-200">
                <img
                    :src="post.cover || 'https://placehold.co/800x450?text=Blog'"
                    :alt="post.title"
                    class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div class="px-5 py-4 space-y-3 text-right">
                <div class="flex items-center justify-between gap-2 text-xs text-base-content/60">
                  <span>{{ formatDate(post.date) }}</span>
                  <span v-if="post.category" class="badge badge-ghost badge-sm">{{ post.category }}</span>
                </div>
                <h3 class="font-semibold text-base leading-7 line-clamp-2">{{ post.title }}</h3>
                <p class="text-sm text-base-content/70 line-clamp-3">{{ post.excerpt }}</p>
                <div class="flex justify-end">
                  <RouterLink
                      :to="`/blog/${post.slug}`"
                      class="text-primary font-medium hover:text-primary/80 inline-flex items-center gap-1"
                  >
                    ادامه مطلب
                    <span class="text-base">←</span>
                  </RouterLink>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import HeroAppleOneBanner from '@/components/HeroAppleOneBanner.vue'
import ProductCarousel from '@/components/ProductCarousel.vue'

/* ✅ API CLIENTS */
import { getTopWeeklyProducts, listProducts } from '@/services/products'
import { listBlogPosts } from '@/services/blog'

// ✅ فقط همین رو استفاده می‌کنیم (بدون GET تک‌بنر)
import { adminListBanners } from '@/services/admin'

/* =============== 4 HOME BANNERS (ACTIVE ONLY) =============== */
type HomeBannerVM = { id: string | number; image: string; alt: string; to: string }

function resolveUrl(u: any) {
  if (!u) return 'https://placehold.co/800x450?text=Product'

  const s = String(u).trim()
  if (!s) return 'https://placehold.co/800x450?text=Product'
  if (/^https?:\/\//i.test(s)) return s

  // اگر آدرس نسبی بود، به API Base بچسبان
  const base = String(import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  if (!base) return s // اگر بیس نداری، همون رو برگردون

  return `${base}${s.startsWith('/') ? '' : '/'}${s}`
}

function pickProductImage(p: any) {
  const raw =
      p?.image_url ??
      p?.imageUrl ??
      p?.image ??
      p?.thumbnail ??
      p?.cover_image ??
      p?.cover ??
      (Array.isArray(p?.images) ? (p.images[0]?.url ?? p.images[0]) : null)

  return resolveUrl(raw)
}


// ✅ fallback اولیه تا چینش بهم نخوره
const FALLBACK_BANNERS: HomeBannerVM[] = [
  { id: 'spotify', image: '/banners/banner-spotify.jpg', alt: 'Spotify', to: '/category/accounts' },
  { id: 'apple-music', image: '/banners/banner-apple-music.jpg', alt: 'Apple Music', to: '/category/accounts' },
  { id: 'youtube', image: '/banners/banner-youtube.jpg', alt: 'Youtube Premium', to: '/category/accounts' },
  { id: 'xbox', image: '/banners/banner-xbox.jpg', alt: 'Xbox Game Pass', to: '/category/accounts' },
]

const banners = ref<HomeBannerVM[]>([...FALLBACK_BANNERS])

function isActiveStatus(status: any) {
  const s = String(status ?? '').trim().toLowerCase()
  return s === 'active' || s === '1' || s === 'true' || s === 'enabled'
}

async function loadHomeBanners() {
  try {
    const data: any = await adminListBanners()
    const items: any[] =
        Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : Array.isArray(data?.banners) ? data.banners : []

    // ✅ فقط بنرهای active
    const actives: HomeBannerVM[] = items
        .filter((b: any) => b && isActiveStatus(b.status))
        .map((b: any) => ({
          id: b.id,
          image: b.image_url || 'https://placehold.co/1200x700?text=Banner',
          alt: b.title || 'Banner',
          to: '/category/accounts',
        }))
        .slice(0, 4)

    // ✅ اگر کمتر از ۴ تا بود با fallback پر می‌کنیم
    const filled: HomeBannerVM[] = actives.slice()
    while (filled.length < 4) filled.push(FALLBACK_BANNERS[filled.length])

    banners.value = filled
  } catch (e) {
    console.error('loadHomeBanners error:', e)
    // fallback میمونه
  }
}

/* =============== TOP WEEKLY =============== */
const topWeeklyProducts = ref<any[]>([])
const topWeeklyLoading = ref(false)
const topWeeklyError = ref<string | null>(null)

async function loadTopWeekly(limit = 8) {
  topWeeklyLoading.value = true
  topWeeklyError.value = null
  try {
    const data: any = await getTopWeeklyProducts(limit)
    const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []
    topWeeklyProducts.value = items
  } catch (e: any) {
    console.error('getTopWeeklyProducts error:', e)
    topWeeklyError.value = e?.message || 'خطا در بارگذاری پرفروش‌ها'
    topWeeklyProducts.value = []
  } finally {
    topWeeklyLoading.value = false
  }
}

/* =============== GIFT CARDS =============== */
const giftCards = ref<any[]>([])
const giftCardsLoading = ref(false)
const giftCardsError = ref<string | null>(null)

function isGiftCard(p: any) {
  if (Number(p?.category_id) === 2 || Number(p?.categoryId) === 2) return true

  const slug = String(p?.category_slug ?? p?.categorySlug ?? p?.category?.slug ?? '').toLowerCase()
  const name = String(p?.category_name ?? p?.categoryName ?? p?.category?.name ?? '').toLowerCase()

  if (slug === 'gift-card' || slug === 'gift-cards') return true
  if (name.includes('گیفت') || name.includes('gift')) return true

  const tags = Array.isArray(p?.tags) ? p.tags.map((t: any) => String(t).toLowerCase()) : []
  if (tags.some((t: string) => t.includes('gift'))) return true
  if (tags.some((t: string) => t.includes('گیفت'))) return true

  return false
}

async function loadGiftCards(limit = 8) {
  giftCardsLoading.value = true
  giftCardsError.value = null
  try {
    const data: any = await listProducts()

    const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
            ? data.items
            : []

    giftCards.value = items
        .filter(isGiftCard)
        .slice(0, limit)
        .map((p: any) => {
          const img = pickProductImage(p)
          return {
            ...p,
            // برای هر نوع پیاده‌سازی ProductCarousel مفیده
            image_url: img,
            image: img,
            cover: p?.cover ?? img,
          }
        })
  } catch (e: any) {
    console.error('listProducts error:', e)
    giftCardsError.value = e?.message || 'خطا در بارگذاری گیفت کارت‌ها'
    giftCards.value = []
  } finally {
    giftCardsLoading.value = false
  }
}


/* =============== BLOG =============== */
type BlogPostVM = {
  slug: string
  title: string
  excerpt: string
  cover?: string
  date?: string
  createdAt?: string
  category?: string
}

const blogPosts = ref<BlogPostVM[]>([])
const blogLoading = ref(false)
const blogError = ref<string | null>(null)

const fetchBlogPosts = async () => {
  blogLoading.value = true
  blogError.value = null
  try {
    const data: any = await listBlogPosts()
    const items: any[] = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []

    blogPosts.value = items
        .map((p: any) => ({
          slug: String(p.slug ?? p.id ?? ''),
          title: String(p.title ?? ''),
          excerpt: String(p.excerpt ?? p.summary ?? ''),
          cover: p.cover_image ?? p.cover ?? p.image ?? null,
          date: p.published_at ?? p.created_at ?? p.date ?? null,
          createdAt: p.created_at ?? null,
          category: p.category ?? null,
        }))
        .filter((p) => p.slug && p.title)
        .sort((a: any, b: any) => {
          const ad = new Date(a.date || a.createdAt || 0).getTime()
          const bd = new Date(b.date || b.createdAt || 0).getTime()
          return bd - ad
        })
        .slice(0, 3)
  } catch (error: any) {
    console.error('listBlogPosts error:', error)
    blogError.value = error?.message || 'خطا در بارگذاری مطالب بلاگ'
    blogPosts.value = []
  } finally {
    blogLoading.value = false
  }
}

function formatDate(val?: string) {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  return d.toLocaleDateString('fa-IR')
}

/* =============== SLIDER =============== */
const slides = ref([
  // ✅ فقط مقصد کلیک اسلایدرها تغییر کرد
  { id: 'gemini', image: '/banners/slider-gemini.jpg', alt: 'خرید اشتراک جیمینی', to: '/category/accounts' },
  { id: 'grok', image: '/banners/slider-grok.png', alt: 'خرید اشتراک گراک', to: '/category/accounts' },
  { id: 'chat-gpt', image: '/banners/slider-chat-gpt.jpg', alt: 'خرید اشتراک چت جیبیتی', to: '/category/accounts' },
])

const current = ref(0)
const AUTOPLAY_DELAY = 5000
let autoplayTimer: ReturnType<typeof setInterval> | null = null

function startAutoplay() {
  if (autoplayTimer) return
  autoplayTimer = setInterval(() => next(false), AUTOPLAY_DELAY)
}
function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}
function restartAutoplay() {
  stopAutoplay()
  startAutoplay()
}
function next(reset = true) {
  current.value = (current.value + 1) % slides.value.length
  if (reset) restartAutoplay()
}
function prev() {
  current.value = (current.value - 1 + slides.value.length) % slides.value.length
  restartAutoplay()
}
function go(i: number) {
  current.value = i
  restartAutoplay()
}

/* =============== REVIEWS / STATIC =============== */
const reviews = ref([
  { id: 1, name: 'مهدی ر.', initials: 'م ر', meta: 'خریدار اشتراک اپل موزیک', text: 'سرعت تحویل و راهنمایی برای فعال‌سازی عالی بود. اولین خریدم از میتراپی بود و کاملاً راضی بودم.', stars: 5, date: '۲ روز پیش' },
  { id: 2, name: 'سارا ک.', initials: 'س ک', meta: 'خریدار گیفت‌کارت استیم', text: 'قیمت‌ها نسبت به بازار خوب بود و کد بدون مشکل روی اکانتم فعال شد. پشتیبانی هم پاسخ‌گو بود.', stars: 4, date: '۱ هفته پیش' },
  { id: 3, name: 'امیر ح.', initials: 'ا ح', meta: 'خریدار اکانت iCloud+', text: 'برای بکاپ گوشی‌هام به فضای بیشتر نیاز داشتم، خیلی سریع برام فعال شد و راهنمای قدم‌به‌قدم هم داشت.', stars: 5, date: '۱۰ روز پیش' },
])

/* =============== LIFECYCLE =============== */
onMounted(async () => {
  await Promise.all([
    loadHomeBanners(), // ✅ بنرهای فعال
    loadTopWeekly(8),
    loadGiftCards(8),
    fetchBlogPosts(),
  ])
  startAutoplay()
})

onBeforeUnmount(() => stopAutoplay())
</script>

<style scoped>
.slider-horizontal-enter-active,
.slider-horizontal-leave-active {
  transition: transform 380ms ease-in-out, opacity 380ms ease-in-out;
}
.slider-horizontal-leave-active {
  position: absolute;
  inset: 0;
}
.slider-horizontal-enter-from {
  transform: translateX(100%);
  opacity: 0.9;
}
.slider-horizontal-leave-to {
  transform: translateX(-100%);
  opacity: 0.9;
}

.slider-fade-enter-active,
.slider-fade-leave-active {
  transition: opacity 0.4s ease;
}
.slider-fade-enter-from,
.slider-fade-leave-to {
  opacity: 0;
}
.slider-fade-enter-to,
.slider-fade-leave-from {
  opacity: 1;
}
</style>
