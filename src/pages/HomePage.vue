<template>
  <div class="relative bg-gradient-to-b from-base-200 to-base-100 min-h-screen pb-20 overflow-hidden">
    <!-- بک‌گراند مینیمال -->
    <div
        class="pointer-events-none absolute -top-32 -left-40 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
    ></div>
    <div
        class="pointer-events-none absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl"
    ></div>

    <div class="relative max-w-6xl mx-auto px-4 lg:px-0 space-y-16 pt-10">

      <!-- 4 BANNERS (2x2) -->
      <section class="grid gap-5 sm:grid-cols-2">
        <RouterLink
            v-for="banner in banners"
            :key="banner.id"
            :to="banner.to"
            class="group relative block rounded-[28px] overflow-hidden bg-base-100 border border-base-300 shadow-sm hover:shadow-xl transition-all duration-200"
        >
          <img
              :src="banner.image"
              :alt="banner.alt"
              class="w-full h-auto block object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
          <div
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </RouterLink>
      </section>

      <!-- BANNER SLIDER -->
      <section class="relative">
        <div
            class="relative overflow-hidden rounded-[32px] bg-base-100 border border-base-300 shadow-sm"
        >
          <RouterLink :to="slides[current].to" class="block">
            <Transition name="slider-fade">
              <img
                  :key="slides[current].id"
                  :src="slides[current].image"
                  :alt="slides[current].alt"
                  class="w-full h-[230px] md:h-[340px] object-cover"
              />
            </Transition>
          </RouterLink>

          <!-- arrows -->
          <button
              class="absolute top-1/2 -translate-y-1/2 right-4 w-9 h-9 md:w-10 md:h-10 rounded-full bg-base-100/90 border border-base-300 backdrop-blur flex items-center justify-center text-base-content hover:bg-primary hover:text-primary-content hover:border-primary transition"
              @click="prev"
          >
            ←
          </button>
          <button
              class="absolute top-1/2 -translate-y-1/2 left-4 w-9 h-9 md:w-10 md:h-10 rounded-full bg-base-100/90 border border-base-300 backdrop-blur flex items-center justify-center text-base-content hover:bg-primary hover:text-primary-content hover:border-primary transition"
              @click="next"
          >
            →
          </button>

          <!-- dots -->
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <button
                v-for="(s, idx) in slides"
                :key="s.id"
                class="w-3 h-3 rounded-full transition-all duration-200"
                :class="idx === current ? 'bg-primary scale-110' : 'bg-base-300 hover:bg-base-400'"
                @click="go(idx)"
            ></button>
          </div>
        </div>
      </section>

      <!-- TOP PRODUCTS -->
      <section class="space-y-6">
        <div class="flex items-center justify-between gap-4">
          <div class="space-y-1">
            <h2 class="text-xl md:text-2xl font-extrabold flex items-center gap-2">
              🔥 پرفروش‌های این هفته
            </h2>
          </div>
          <RouterLink
              to="/category/accounts"
              class="btn btn-sm btn-outline rounded-full text-sm"
          >
            مشاهده همه
          </RouterLink>
        </div>
        <ProductGrid :products="top" />
      </section>

      <!-- GIFT CARDS -->
      <section class="space-y-6">
        <div class="flex items-center justify-between gap-4">
          <div class="space-y-1">
            <h2 class="text-xl md:text-2xl font-extrabold flex items-center gap-2">
              🎁 خرید گیفت‌کارت‌ها
            </h2>
            <p class="text-sm text-base-content/60">
              گیفت‌کارت‌های اپل، استیم، گوگل‌پلی و سرویس‌های محبوب
            </p>
          </div>
          <RouterLink
              to="/category/gift-cards"
              class="btn btn-sm btn-outline rounded-full text-sm"
          >
            مشاهده همه گیفت‌کارت‌ها
          </RouterLink>
        </div>
        <ProductGrid :products="giftCards" />
      </section>

      <!-- USER REVIEWS -->
      <section class="space-y-6">
        <div class="flex flex-col items-center text-center gap-2">
          <h2 class="text-2xl font-extrabold">نظرات کاربران میتراپی</h2>
          <p class="text-sm text-base-content/60 max-w-xl">
            تجربه‌ی خرید از میتراپی از زبان کسانی که قبلاً از سرویس استفاده کرده‌اند.
          </p>
          <div class="w-16 h-[3px] bg-base-content/80 rounded-full mt-2"></div>
        </div>

        <div class="grid gap-5 md:grid-cols-3">
          <article
              v-for="review in reviews"
              :key="review.id"
              class="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-5 flex flex-col gap-3"
          >
            <div class="flex items-center gap-3">
              <div
                  class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm"
              >
                {{ review.initials }}
              </div>
              <div>
                <div class="text-sm font-semibold">{{ review.name }}</div>
                <div class="text-[11px] text-base-content/60">
                  {{ review.meta }}
                </div>
              </div>
            </div>
            <p class="text-sm text-base-content/80 leading-relaxed line-clamp-4">
              {{ review.text }}
            </p>
            <div class="mt-auto flex items-center justify-between pt-2 text-xs">
              <div class="flex items-center gap-1 text-amber-400">
                <span v-for="n in 5" :key="n">
                  <span v-if="n <= review.stars">★</span>
                  <span v-else class="text-base-content/20">★</span>
                </span>
              </div>
              <span class="text-base-content/50">{{ review.date }}</span>
            </div>
          </article>
        </div>
      </section>

      <!-- APPLE SERVICES (محبوب‌ترین اکانت‌ها) -->
      <section class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h2 class="text-xl md:text-2xl font-extrabold">محبوب‌ترین اکانت‌ها</h2>
            <p class="text-sm text-base-content/60">
              سرویس‌های اپل و اشتراک‌های پرطرفدار
            </p>
          </div>
          <div class="w-16 h-[3px] bg-base-content/80 rounded-full"></div>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div
              v-for="card in serviceCards"
              :key="card.slug"
              class="rounded-[26px] px-5 py-5 text-white flex flex-col gap-3 relative overflow-hidden min-h-[190px] transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
              :style="{ background: card.bg }"
          >
            <div class="flex items-center gap-2">
              <img v-if="card.icon" :src="card.icon" class="w-9 h-9 object-contain" alt="" />
              <h3 class="text-base font-bold drop-shadow-sm">{{ card.title }}</h3>
            </div>
            <p class="text-xs text-white/80 leading-relaxed line-clamp-3">
              {{ card.desc }}
            </p>
            <RouterLink
                :to="card.to"
                class="btn btn-xs bg-white text-black border-0 rounded-full w-fit mt-auto hover:bg-base-200"
            >
              {{ card.action }}
            </RouterLink>
            <img
                v-if="card.thumb"
                :src="card.thumb"
                class="absolute left-2 bottom-2 w-16 opacity-80 pointer-events-none object-contain"
            />
          </div>
        </div>
      </section>

      <!-- BLOG -->
      <section class="space-y-8">
        <div class="flex flex-col items-center text-center">
          <h2 class="text-2xl font-extrabold">وبلاگ میتراپی</h2>
          <p class="text-sm text-base-content/60 mt-2 max-w-xl">
            آموزش‌ها و نکته‌های کاربردی برای سرویس‌های دیجیتال، مدیریت اشتراک‌ها و خرید امن.
          </p>
          <div class="w-16 h-[3px] bg-base-content/80 rounded-full mt-3"></div>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <article
              v-for="post in blogPosts"
              :key="post.slug"
              class="relative bg-base-100 rounded-2xl overflow-hidden border border-base-300 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div class="h-44 overflow-hidden">
              <img
                  :src="post.image"
                  :alt="post.title"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div
                class="bg-base-100 rounded-xl shadow-md px-5 py-4 absolute left-5 right-5 -bottom-10 md:-bottom-9"
            >
              <h3 class="font-medium text-sm md:text-base mb-2 line-clamp-2">
                {{ post.title }}
              </h3>
              <p
                  class="text-xs text-base-content/60 flex items-center justify-between gap-2"
              >
                <span class="truncate">{{ post.date }}</span>
                <RouterLink
                    :to="`/blog/${post.slug}`"
                    class="text-primary text-xs hover:underline"
                >
                  مطالعه
                </RouterLink>
              </p>
            </div>
            <div class="h-12"></div>
          </article>
        </div>

        <div class="flex justify-center">
          <RouterLink
              to="/blog"
              class="btn btn-outline rounded-full text-sm"
          >
            مشاهده همه مطالب وبلاگ
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, ref } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductGrid from '@/components/ProductGrid.vue'

const store = useProductsStore()

const current = ref(0)
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

// اسلایدر خودکار
const AUTOPLAY_DELAY = 5000 // میلی‌ثانیه
let autoplayTimer: ReturnType<typeof setInterval> | null = null

function startAutoplay() {
  if (autoplayTimer) return
  autoplayTimer = setInterval(() => {
    next(false)
  }, AUTOPLAY_DELAY)
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

function resetAutoplay() {
  stopAutoplay()
  startAutoplay()
}

function next(reset = true) {
  current.value = (current.value + 1) % slides.value.length
  if (reset) resetAutoplay()
}
function prev() {
  current.value =
      (current.value - 1 + slides.value.length) % slides.value.length
  resetAutoplay()
}
function go(i: number) {
  current.value = i
  resetAutoplay()
}

onMounted(() => {
  store.load()
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})

const top = computed(() => store.products.slice(0, 8))

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

const reviews = ref([
  {
    id: 1,
    name: 'مهدی ر.',
    initials: 'م ر',
    meta: 'خریدار اشتراک اپل موزیک',
    text: 'سرعت تحویل و راهنمایی برای فعال‌سازی عالی بود. اولین خریدم از میتراپی بود و کاملاً راضی بودم.',
    stars: 5,
    date: '۲ روز پیش',
  },
  {
    id: 2,
    name: 'سارا ک.',
    initials: 'س ک',
    meta: 'خریدار گیفت‌کارت استیم',
    text: 'قیمت‌ها نسبت به بازار خوب بود و کد بدون مشکل روی اکانتم فعال شد. پشتیبانی هم پاسخ‌گو بود.',
    stars: 4,
    date: '۱ هفته پیش',
  },
  {
    id: 3,
    name: 'امیر ح.',
    initials: 'ا ح',
    meta: 'خریدار اکانت iCloud+',
    text: 'برای بکاپ گوشی‌هام به فضای بیشتر نیاز داشتم، خیلی سریع برام فعال شد و راهنمای قدم‌به‌قدم هم داشت.',
    stars: 5,
    date: '۱۰ روز پیش',
  },
])
</script>

<style scoped>
.slider-fade-enter-active,
.slider-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.slider-fade-enter-from {
  opacity: 0;
  transform: scale(1.03);
}
.slider-fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
.slider-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
.slider-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
