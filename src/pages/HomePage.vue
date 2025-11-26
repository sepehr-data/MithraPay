<template>
  <div class="bg-base-200/80 min-h-screen">
    <main class="max-w-6xl mx-auto px-4 lg:px-0 py-8 space-y-12">

      <HeroAppleOneBanner />

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
            <p class="text-sm text-base-content/60">محبوب‌ترین اشتراک‌ها و اکانت‌ها</p>
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
            <p class="text-xs text-primary font-semibold">گیفت کارت‌های برگزیده</p>
            <div class="flex items-center gap-3">
              <h2 id="gift-cards" class="text-2xl font-bold">پرفروش‌ترین گیفت کارت‌ها</h2>
              <span class="h-1 w-10 rounded-full bg-primary/70 hidden sm:inline-block"></span>
            </div>
            <p class="text-sm text-base-content/60">
              گیفت کارت‌های اپل، پلی‌استیشن، استیم و سرویس‌های محبوب
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
          <div v-if="productsLoading" class="text-center py-8 text-sm text-base-content/60">
            در حال بارگذاری گیفت کارت‌ها...
          </div>
          <div v-else-if="!giftCards.length" class="text-center py-8 text-sm text-base-content/60">
            گیفت کارتی برای نمایش وجود ندارد.
          </div>
          <ProductGrid v-else :products="giftCards" />
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
          <div v-if="blogLoading" class="text-center py-6 text-sm text-base-content/60">در حال بارگذاری مطالب...</div>
          <div v-else-if="blogError" class="text-center py-6 text-error text-sm">{{ blogError }}</div>
          <div v-else-if="!blogPosts.length" class="text-center py-6 text-sm text-base-content/60">مطلبی برای نمایش وجود ندارد.</div>

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
import { onMounted, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { listPosts } from '@/services/api'
import type { BlogPost } from '@/services/types'
import { useProductsStore } from '@/stores/products'
import ProductGrid from '@/components/ProductGrid.vue'
import HeroAppleOneBanner from '@/components/HeroAppleOneBanner.vue'

const store = useProductsStore()
const { topWeeklyProducts, topWeeklyLoading, topWeeklyError, loading: productsLoading } = storeToRefs(store)

const blogPosts = ref<BlogPost[]>([])
const blogLoading = ref(false)
const blogError = ref<string | null>(null)

onMounted(async () => {
  await store.load()
  await store.fetchTopWeeklyProducts(8)
  await fetchBlogPosts()
})

const giftCards = computed(() =>
  store.products
    .filter(
      (p: any) =>
        p.categoryId === 'cat-gift' ||
        p.categoryId === 'gift-cards' ||
        p?.tags?.includes('gift-card') ||
        p?.tags?.includes('گیفت‌کارت') ||
        p?.tags?.includes('گیفت')
    )
    .slice(0, 8)
)

const fetchBlogPosts = async () => {
  blogLoading.value = true
  blogError.value = null
  try {
    const posts = await listPosts()
    blogPosts.value = [...posts]
      .sort((a: any, b: any) => {
        const ad = new Date(a.date || a.createdAt || 0).getTime()
        const bd = new Date(b.date || b.createdAt || 0).getTime()
        return bd - ad
      })
      .slice(0, 6)
  } catch (error: any) {
    blogError.value = error?.message || 'خطا در بارگذاری مطالب بلاگ'
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
