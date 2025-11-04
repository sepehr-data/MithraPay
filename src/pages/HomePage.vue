<template>
  <div class="min-h-screen">
    <!-- HERO -->
    <section class="mb-10">
      <div class="hero rounded-3xl bg-base-100 border border-base-300">
        <div class="hero-content flex-col lg:flex-row-reverse">
          <img src="https://placehold.co/480x320" class="max-w-sm rounded-2xl shadow" />
          <div>
            <h1 class="text-3xl font-extrabold mb-3">اکانت‌ها، گیفت‌کارت و لوازم جانبی</h1>
            <p class="opacity-80 mb-4">خرید آسان، تحویل سریع، پشتیبانی حرفه‌ای</p>
            <div class="join">
              <RouterLink to="/category/accounts" class="btn btn-primary join-item">مشاهده اکانت‌ها</RouterLink>
              <RouterLink to="/category/gift-cards" class="btn btn-secondary join-item">گیفت‌کارت‌ها</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TOP PRODUCTS -->
    <section class="space-y-6">
      <h2 class="text-xl font-bold">پرفروش‌های این هفته</h2>
      <ProductGrid :products="top" />
    </section>

    <!-- APPLE SERVICES / DIGITAL CARDS (new) -->
    <section class="mt-16 space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">محبوب‌ترین اکانت‌ها</h2>
        <div class="w-12 h-[3px] bg-base-content/80 rounded-full"></div>
      </div>

      <div class="grid gap-6 md:grid-cols-3 sm:grid-cols-2">
        <div
            v-for="card in serviceCards"
            :key="card.slug"
            class="rounded-[30px] px-6 py-6 text-white flex flex-col gap-3 relative overflow-hidden"
            :style="{ background: card.bg }"
        >
          <div class="flex items-center gap-2">
            <img v-if="card.icon" :src="card.icon" class="w-10 h-10" alt="" />
            <h3 class="text-lg font-bold">{{ card.title }}</h3>
          </div>
          <p class="text-sm text-white/80 leading-relaxed">
            {{ card.desc }}
          </p>
          <RouterLink
              :to="card.to"
              class="btn btn-sm bg-white text-black border-0 rounded-full w-fit mt-auto"
          >
            {{ card.action }}
          </RouterLink>
          <img
              v-if="card.thumb"
              :src="card.thumb"
              class="absolute left-4 bottom-3 w-20 opacity-80 pointer-events-none"
          />
        </div>
      </div>
    </section>

    <!-- PHYSICAL PRODUCTS -->
    <section class="mt-16 space-y-8">
      <!-- banner -->
      <div
          class="rounded-[30px] bg-base-100 border border-base-200 px-6 py-10 md:px-12 flex flex-col md:flex-row items-center gap-8 overflow-hidden"
      >
        <div class="flex-1">
          <h2 class="text-3xl md:text-4xl font-extrabold mb-3">محصولات فیزیکی</h2>
          <p class="text-base-content/70 mb-4">
            تحویل سریع، تضمین قیمت، گارانتی اصالت
          </p>
          <RouterLink to="/category/accessories" class="btn btn-primary rounded-full">
            مشاهده کل محصولات
          </RouterLink>
        </div>
        <div class="w-full md:w-[320px]">
          <img
              src="https://placehold.co/480x280?text=Apple+Accessories"
              class="w-full h-auto object-contain"
              alt="محصولات فیزیکی"
          />
        </div>
      </div>

      <!-- list -->
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold">محصولات فیزیکی</h3>
        <RouterLink to="/category/accessories" class="text-sm text-primary hover:underline">
          مشاهده همه
        </RouterLink>
      </div>

      <div class="grid gap-6 md:grid-cols-4 sm:grid-cols-2">
        <div
            v-for="item in physical"
            :key="item.id"
            class="rounded-2xl border border-base-200 bg-base-100 overflow-hidden flex flex-col"
        >
          <div class="h-36 bg-base-200/40 flex items-center justify-center">
            <img
                :src="item.image || 'https://placehold.co/200x200?text=Item'"
                :alt="item.title"
                class="h-28 object-contain"
            />
          </div>
          <div class="p-4 flex flex-col gap-2">
            <h4 class="font-medium line-clamp-2">{{ item.title }}</h4>
            <p v-if="item.price" class="text-sm font-bold">{{ formatPrice(item.price) }}</p>
            <RouterLink :to="`/product/${item.slug}`" class="btn btn-sm btn-outline mt-auto">
              مشاهده
            </RouterLink>
          </div>
        </div>

        <p v-if="!physical.length" class="text-sm text-base-content/50 col-span-full">
          هنوز محصول فیزیکی اضافه نشده است.
        </p>
      </div>
    </section>

    <!-- BLOG SECTION -->
    <section class="mt-16 mb-10">
      <div class="flex flex-col items-center mb-10">
        <h2 class="text-2xl font-bold">وبلاگ پلاس</h2>
        <div class="w-16 h-1 bg-base-content/80 rounded-full mt-3"></div>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <article
            v-for="post in blogPosts"
            :key="post.slug"
            class="relative bg-base-100 rounded-2xl overflow-hidden shadow-sm"
        >
          <div class="h-44 overflow-hidden">
            <img :src="post.image" :alt="post.title" class="w-full h-full object-cover" />
          </div>
          <div
              class="bg-base-100 rounded-xl shadow-md px-5 py-4 absolute left-5 right-5 -bottom-10 md:-bottom-9"
          >
            <h3 class="font-medium text-base mb-2 line-clamp-2">
              {{ post.title }}
            </h3>
            <p class="text-xs text-base-content/60 flex items-center justify-between">
              <span>{{ post.date }}</span>
              <RouterLink :to="`/blog/${post.slug}`" class="text-primary text-xs">مطالعه</RouterLink>
            </p>
          </div>
          <div class="h-12"></div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import ProductGrid from '@/components/ProductGrid.vue'
import { useProductsStore } from '@/stores/products'
import { onMounted, computed, ref } from 'vue'

const store = useProductsStore()
onMounted(() => store.load())

const top = computed(() => store.products.slice(0, 8))

const physical = computed(() =>
    store.products.filter((p: any) => !p.isDigital).slice(0, 4)
)

// cards for banner (you can change colors / links)
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

// blog data
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
    // 👇 توضیحش پایین‌تر
    image: 'https://placehold.co/600x360?text=Apple+Arcade',
  },
  {
    slug: 'youtube-premium-iran',
    title: 'بررسی مزایای YouTube Premium برای کاربران ایرانی',
    date: 'دوشنبه ۵ آبان ۱۴۰۴',
    image: 'https://placehold.co/600x360?text=YouTube',
  },
])

function formatPrice(val: number) {
  if (!val && val !== 0) return ''
  return new Intl.NumberFormat('fa-IR').format(val) + ' تومان'
}
</script>