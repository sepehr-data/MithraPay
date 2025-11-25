<template>
  <div class="bg-base-200/80 min-h-screen">
    <main class="max-w-6xl mx-auto px-4 lg:px-0 py-8 space-y-12">

      <!-- 4 BANNERS (2x2) -->
      <section aria-label="ویژگی ها" class="grid gap-4 sm:grid-cols-2">
        <RouterLink
          v-for="banner in banners"
          :key="banner.id"
          :to="banner.to"
          class="group relative block overflow-hidden rounded-[26px] bg-gradient-to-br from-base-100 to-base-100/80 shadow-sm ring-1 ring-base-300/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <img
            :src="banner.image"
            :alt="banner.alt"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition group-hover:opacity-70"></div>
        </RouterLink>
      </section>

      <!-- BANNER SLIDER -->
      <section aria-label="بنر اصلی" class="relative">
        <div
          class="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-base-100 to-base-100/60 border border-base-300/70 shadow-lg"
        >
          <RouterLink :to="slides[current].to" class="block">
            <div class="bg-gradient-to-t from-base-300/50 to-transparent">
              <img
                :src="slides[current].image"
                :alt="slides[current].alt"
                class="w-full h-[240px] md:h-[360px] object-cover"
              />
            </div>
          </RouterLink>

          <!-- arrows -->
          <button
            class="absolute top-1/2 -translate-y-1/2 right-5 w-10 h-10 rounded-full bg-base-100/90 shadow-md flex items-center justify-center text-lg text-base-content transition hover:bg-primary hover:text-primary-content"
            @click="prev"
          >
            ←
          </button>
          <button
            class="absolute top-1/2 -translate-y-1/2 left-5 w-10 h-10 rounded-full bg-base-100/90 shadow-md flex items-center justify-center text-lg text-base-content transition hover:bg-primary hover:text-primary-content"
            @click="next"
          >
            →
          </button>

          <!-- dots -->
          <div class="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            <button
              v-for="(s, idx) in slides"
              :key="s.id"
              class="w-2.5 h-2.5 rounded-full transition-all duration-200"
              :class="idx === current ? 'bg-primary scale-110' : 'bg-base-300 hover:bg-primary/70'"
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
          </div>
          <RouterLink
            to="/category/accounts"
            class="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
          >
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
          <ProductGrid v-else :products="topWeeklyProducts" />
        </div>
      </section>

      <!-- GIFT CARDS -->
      <section aria-labelledby="gift-cards" class="space-y-5">
        <header class="flex items-center justify-between gap-4">
          <div class="space-y-1">
            <p class="text-xs text-primary font-semibold">گیفت کارت</p>
            <div class="flex items-center gap-3">
              <h2 id="gift-cards" class="text-2xl font-bold">خرید گیفت‌کارت‌ها</h2>
              <span class="h-1 w-10 rounded-full bg-primary/70 hidden sm:inline-block"></span>
            </div>
            <p class="text-sm text-base-content/60">
              گیفت‌کارت‌های اپل، استیم، گوگل‌پلی و سرویس‌های محبوب
            </p>
          </div>
          <RouterLink
            to="/category/gift-cards"
            class="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
          >
            مشاهده همه گیفت‌کارت‌ها
            <span class="text-base">←</span>
          </RouterLink>
        </header>
        <div class="rounded-[24px] bg-base-100/80 shadow-sm ring-1 ring-base-300/70 px-3 sm:px-4 py-4">
          <ProductGrid :products="giftCards" />
        </div>
      </section>


      <!-- BLOG -->
      <section aria-labelledby="blog" class="space-y-6">
        <div class="flex flex-col items-center text-center gap-2">
          <p class="text-xs text-primary font-semibold">وبلاگ پلاس</p>
          <h2 id="blog" class="text-2xl font-bold">آخرین مطالب</h2>
          <p class="text-sm text-base-content/60">آموزش‌ها و نکته‌های کاربردی برای سرویس‌های دیجیتال</p>
          <div class="w-16 h-1 bg-primary/70 rounded-full"></div>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <article
            v-for="post in blogPosts"
            :key="post.slug"
            class="group relative bg-base-100 rounded-2xl overflow-hidden shadow-sm ring-1 ring-base-300/60 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div class="h-44 overflow-hidden">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div class="px-5 py-4 space-y-2">
              <h3 class="font-semibold text-base leading-7 line-clamp-2">{{ post.title }}</h3>
              <div class="flex items-center justify-between text-xs text-base-content/60">
                <span>{{ post.date }}</span>
                <RouterLink
                  :to="`/blog/${post.slug}`"
                  class="text-primary font-medium hover:text-primary/80"
                >
                  مطالعه
                </RouterLink>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/products'
import ProductGrid from '@/components/ProductGrid.vue'

const store = useProductsStore()
const { topWeeklyProducts, topWeeklyLoading, topWeeklyError } = storeToRefs(store)

onMounted(() => {
  store.load()
  store.fetchTopWeeklyProducts(8)
})

const giftCards = computed(() =>
  store.products
    .filter(
      (p: any) =>
        p.categoryId === 'cat-gift' || // ✅ match mock category
        p.categoryId === 'gift-cards' || // (optional: future API)
        p?.tags?.includes('gift-card') ||
        p?.tags?.includes('گیفت‌کارت') ||
        p?.tags?.includes('گیفت')
    )
    .slice(0, 8)
)

const serviceCards = ref([
  {
    slug: 'apple-tv-plus',
    title: ' tv+',
    desc: 'تماشای بهترین فیلم‌ها و سریال‌های روز دنیا',
    action: 'خرید اشتراک اپل تی‌وی',
    to: '/product/apple-tv',
    bg: 'radial-gradient(circle at top, #0f172a, #020617)',
  },
  {
    slug: 'apple-music',
    title: ' Music',
    desc: 'دسترسی به میلیون‌ها موزیک اوریجینال',
    action: 'خرید اشتراک اپل موزیک',
    to: '/product/apple-music',
    bg: 'linear-gradient(160deg, #065f46 0%, #042f2e 100%)',
  },
  {
    slug: 'apple-arcade',
    title: ' Arcade',
    desc: 'دنیا‌یی از بازی‌های جذاب اپل',
    action: 'خرید اشتراک آرکید',
    to: '/product/apple-arcade',
    bg: 'linear-gradient(160deg, #1f2937 0%, #111827 100%)',
  },
  {
    slug: 'icloud-plus',
    title: ' iCloud+',
    desc: 'فضای ابری تا 2TB برای دستگاه‌های اپل',
    action: 'خرید اشتراک آیکلاد',
    to: '/product/icloud',
    bg: 'linear-gradient(160deg, #38bdf8 0%, #0ea5e9 100%)',
  },
  {
    slug: 'apple-news-plus',
    title: ' News+',
    desc: 'آرشیو روزنامه‌ها و مجلات منتخب',
    action: 'خرید اشتراک نیوز پلاس',
    to: '/product/apple-news',
    bg: 'linear-gradient(160deg, #f97316 0%, #ea580c 100%)',
  },
  {
    slug: 'apple-fitness-plus',
    title: ' Fitness+',
    desc: 'تمرین‌های روزانه و کالری‌سوزی هوشمند',
    action: 'خرید اشتراک فیتنس',
    to: '/product/apple-fitness',
    bg: 'linear-gradient(160deg, #c026d3 0%, #701a75 100%)',
  },
])

const blogPosts = ref([
  {
    slug: 'icloud-common-issues',
    title: 'آیکلود یک اپ؛ مشکلات رایج آیکلاد و راه حل رفع آن‌ها',
    date: 'سه‌شنبه ۲۹ مهر ۱۴۰۴',
    image: 'https://placehold.co/600x360?text=iCloud',
  },
  {
    slug: 'apple-arcade-on-mac',
    title: 'چگونه از اپل آرکید در مک‌بوک و آی مک استفاده کنیم؟',
    date: 'جمعه ۲ آبان ۱۴۰۴',
    image: 'https://placehold.co/600x360?text=Apple+Arcade',
  },
  {
    slug: 'youtube-premium-iran',
    title: 'بررسی مزایای YouTube Premium برای کاربران ایرانی',
    date: 'دوشنبه ۵ آبان ۱۴۰۴',
    image: 'https://placehold.co/600x360?text=YouTube',
  },
])

const slides = ref([
  {
    id: 'ps-plus',
    image: '/banners/slider2.webp',
    alt: 'اکانت پلی‌استیشن پلاس قانونی',
    to: '/product/playstation-plus',
  },
  {
    id: 'apple-music',
    image: '/banners/slider1.webp',
    alt: 'Apple Music',
    to: '/product/apple-music-3m',
  },
])

const banners = [
  {
    id: 'apple-tv',
    image: '/banners/slider3.webp',
    alt: 'Apple TV+',
    to: '/product/apple-tv',
  },
  {
    id: 'apple-music',
    image: '/banners/slider4.webp',
    alt: 'Apple Music',
    to: '/product/apple-music-3m',
  },
  {
    id: 'apple-arcade',
    image: '/banners/slider5.webp',
    alt: 'Apple Arcade',
    to: '/product/apple-arcade',
  },
  {
    id: 'icloud-plus',
    image: '/banners/slider6.webp',
    alt: 'iCloud+',
    to: '/product/icloud',
  },
]

const current = ref(0)
function next() {
  current.value = (current.value + 1) % slides.value.length
}
function prev() {
  current.value = (current.value - 1 + slides.value.length) % slides.value.length
}
function go(i: number) {
  current.value = i
}
</script>
