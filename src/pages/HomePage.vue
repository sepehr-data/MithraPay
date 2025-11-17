<template>
  <div class="bg-base-200 min-h-screen pb-16">
    <div class="max-w-6xl mx-auto px-4 lg:px-0 space-y-14 pt-8">

      <!-- 4 BANNERS (2x2) -->
      <section class="grid gap-4 sm:grid-cols-2">
        <RouterLink
            v-for="banner in banners"
            :key="banner.id"
            :to="banner.to"
            class="block rounded-[28px] overflow-hidden bg-base-100"
        >
          <img
              :src="banner.image"
              :alt="banner.alt"
              class="w-full h-auto block"
          />
        </RouterLink>
      </section>


      <!-- HERO -->
<!--      <section>-->
<!--        <div-->
<!--            class="hero rounded-3xl bg-base-100/90 border border-base-300 px-6 py-6 lg:py-8"-->
<!--        >-->
<!--          <div class="hero-content flex-col lg:flex-row-reverse gap-8">-->
<!--            <img-->
<!--                src="https://eshop.macsales.com/blog/wp-content/uploads/2023/03/Apple-Arcade-macos-ventura.png"-->
<!--                class="max-w-sm rounded-2xl shadow-md"-->
<!--                alt="اکانت‌ها و گیفت‌کارت‌ها"-->
<!--            />-->
<!--            <div class="text-right space-y-3 flex-1">-->
<!--              <p class="text-sm text-base-content/60">خرید سریع و مطمئن</p>-->
<!--              <h1 class="text-3xl font-extrabold leading-relaxed">-->
<!--                اکانت‌ها، گیفت‌کارت و لوازم جانبی-->
<!--              </h1>-->
<!--              <p class="opacity-80">-->
<!--                خرید آسان، تحویل سریع، پشتیبانی حرفه‌ای-->
<!--              </p>-->
<!--              <div class="flex gap-3 justify-end">-->
<!--                <RouterLink to="/category/accounts" class="btn btn-primary">-->
<!--                  مشاهده اکانت‌ها-->
<!--                </RouterLink>-->
<!--                <RouterLink to="/category/gift-cards" class="btn btn-outline">-->
<!--                  گیفت‌کارت‌ها-->
<!--                </RouterLink>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </section>-->

      <!-- BANNER SLIDER -->
      <section class="relative">
        <div
            class="relative overflow-hidden rounded-[32px] bg-base-100 border border-base-300"
        >
          <RouterLink :to="slides[current].to" class="block">
            <img
                :src="slides[current].image"
                :alt="slides[current].alt"
                class="w-full h-[230px] md:h-[340px] object-cover"
            />
          </RouterLink>

          <!-- arrows -->
          <button
              class="absolute top-1/2 -translate-y-1/2 right-4 w-8 h-8 md:w-9 md:h-9 rounded-full bg-base-100/90 backdrop-blur flex items-center justify-center text-base-content hover:bg-base-100"
              @click="prev"
          >
            ←
          </button>
          <button
              class="absolute top-1/2 -translate-y-1/2 left-4 w-8 h-8 md:w-9 md:h-9 rounded-full bg-base-100/90 backdrop-blur flex items-center justify-center text-base-content hover:bg-base-100"
              @click="next"
          >
            →
          </button>

          <!-- dots -->
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <button
                v-for="(s, idx) in slides"
                :key="s.id"
                class="w-2.5 h-2.5 rounded-full transition"
                :class="idx === current ? 'bg-primary' : 'bg-base-300'"
                @click="go(idx)"
            ></button>
          </div>
        </div>
      </section>

      <!-- TOP PRODUCTS -->
      <section class="space-y-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold">پرفروش‌های این هفته</h2>
<!--            <p class="text-sm text-base-content/60">-->
<!--              محصولاتی که مشتری‌ها بیشتر انتخابشون کردن 🔥-->
<!--            </p>-->
          </div>
          <RouterLink
              to="/category/accounts"
              class="text-sm text-primary hover:underline"
          >
            مشاهده همه
          </RouterLink>
        </div>
        <ProductGrid :products="top" />
      </section>

      <!-- GIFT CARDS -->
      <section class="space-y-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold">خرید گیفت‌کارت‌ها</h2>
            <p class="text-sm text-base-content/60">
              گیفت‌کارت‌های اپل، استیم، گوگل‌پلی و سرویس‌های محبوب
            </p>
          </div>
          <RouterLink
              to="/category/gift-cards"
              class="text-sm text-primary hover:underline"
          >
            مشاهده همه گیفت‌کارت‌ها
          </RouterLink>
        </div>
        <ProductGrid :products="giftCards" />
      </section>

      <!-- APPLE SERVICES -->
      <section class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold">محبوب‌ترین اکانت‌ها</h2>
            <p class="text-sm text-base-content/60">
              سرویس‌های اپل و اشتراک‌های پرطرفدار
            </p>
          </div>
          <div class="w-12 h-[3px] bg-base-content/80 rounded-full"></div>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div
              v-for="card in serviceCards"
              :key="card.slug"
              class="rounded-[26px] px-5 py-5 text-white flex flex-col gap-3 relative overflow-hidden min-h-[170px]"
              :style="{ background: card.bg }"
          >
            <div class="flex items-center gap-2">
              <img v-if="card.icon" :src="card.icon" class="w-9 h-9" alt="" />
              <h3 class="text-base font-bold">{{ card.title }}</h3>
            </div>
            <p class="text-xs text-white/75 leading-relaxed line-clamp-3">
              {{ card.desc }}
            </p>
            <RouterLink
                :to="card.to"
                class="btn btn-xs bg-white text-black border-0 rounded-full w-fit mt-auto"
            >
              {{ card.action }}
            </RouterLink>
            <img
                v-if="card.thumb"
                :src="card.thumb"
                class="absolute left-2 bottom-2 w-16 opacity-80 pointer-events-none"
            />
          </div>
        </div>
      </section>

      <!-- BLOG -->
<!--      <section class="mb-4">-->
<!--        <div class="flex flex-col items-center mb-10 text-center">-->
<!--          <h2 class="text-2xl font-bold">وبلاگ پلاس</h2>-->
<!--          <p class="text-sm text-base-content/60 mt-2">-->
<!--            آموزش‌ها و نکته‌های کاربردی برای سرویس‌های دیجیتال-->
<!--          </p>-->
<!--          <div class="w-16 h-1 bg-base-content/80 rounded-full mt-3"></div>-->
<!--        </div>-->

<!--        <div class="grid gap-6 md:grid-cols-3">-->
<!--          <article-->
<!--              v-for="post in blogPosts"-->
<!--              :key="post.slug"-->
<!--              class="relative bg-base-100 rounded-2xl overflow-hidden shadow-sm"-->
<!--          >-->
<!--            <div class="h-44 overflow-hidden">-->
<!--              <img-->
<!--                  :src="post.image"-->
<!--                  :alt="post.title"-->
<!--                  class="w-full h-full object-cover"-->
<!--              />-->
<!--            </div>-->
<!--            <div-->
<!--                class="bg-base-100 rounded-xl shadow-md px-5 py-4 absolute left-5 right-5 -bottom-10 md:-bottom-9"-->
<!--            >-->
<!--              <h3 class="font-medium text-base mb-2 line-clamp-2">-->
<!--                {{ post.title }}-->
<!--              </h3>-->
<!--              <p-->
<!--                  class="text-xs text-base-content/60 flex items-center justify-between"-->
<!--              >-->
<!--                <span>{{ post.date }}</span>-->
<!--                <RouterLink-->
<!--                    :to="`/blog/${post.slug}`"-->
<!--                    class="text-primary text-xs"-->
<!--                >-->
<!--                  مطالعه-->
<!--                </RouterLink>-->
<!--              </p>-->
<!--            </div>-->
<!--            <div class="h-12"></div>-->
<!--          </article>-->
<!--        </div>-->
<!--      </section>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductGrid from '@/components/ProductGrid.vue'

const store = useProductsStore()
onMounted(() => store.load())

const top = computed(() => store.products.slice(0, 8))

const giftCards = computed(() =>
    store.products
        .filter(
            (p: any) =>
                p.categoryId === 'cat-gift' ||     // ✅ match mock category
                p.categoryId === 'gift-cards' ||   // (optional: future API)
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
  current.value =
      (current.value - 1 + slides.value.length) % slides.value.length
}
function go(i: number) {
  current.value = i
}
</script>
