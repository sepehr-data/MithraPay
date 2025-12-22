<template>
  <div class="product-grid">
    <article
        v-for="p in products"
        :key="p.id"
        class="product-card"
    >
      <!-- media -->
      <div class="media">
        <!-- badge -->
        <div v-if="isDiscount(p)" class="badge">
          تخفیف
        </div>

        <!-- image (اگر تصویر داری) -->
        <img
            v-if="p.image"
            :src="p.image"
            :alt="p.title"
            class="media-img"
            loading="lazy"
        />

        <!-- fallback -->
        <div v-else class="media-fallback">
          <span class="text-2xl">🎁</span>
        </div>
      </div>

      <!-- content -->
      <div class="content">
        <div class="top">
          <div class="meta">
            <span class="pill" :class="p.isDigital ? 'pill--digital' : 'pill--physical'">
              {{ p.isDigital ? 'محصول دیجیتال' : 'تحویل فیزیکی' }}
            </span>
            <span v-if="p.region" class="pill pill--neutral">ریجن {{ p.region }}</span>
          </div>

          <h3 class="title line-clamp-2">
            {{ p.title }}
          </h3>

          <p class="desc line-clamp-2">
            {{ p.description || 'محصول مناسب برای خرید و اشتراک با تحویل سریع.' }}
          </p>
        </div>

        <!-- bottom -->
        <div class="bottom">
          <div class="pricebox">
            <p class="price">
              {{ formatPrice(p.price) }} <span class="toman">تومان</span>
            </p>

            <p v-if="p.compareAt" class="compare">
              قیمت قبل:
              <span class="line-through">{{ formatPrice(p.compareAt) }}</span>
              تومان
            </p>
            <p v-else class="compare">بهترین قیمت بازار</p>
          </div>

          <button type="button" class="btn">
            مشاهده و خرید
          </button>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
type Product = {
  id: string | number
  title: string
  description?: string
  price: number
  compareAt?: number
  isDigital: boolean
  image?: string
  region?: string
}

const props = defineProps<{
  products: Product[]
}>()

const isDiscount = (p: Product) => !!(p.compareAt && p.compareAt > p.price)

const formatPrice = (v: number) => {
  try {
    return v?.toLocaleString?.() ?? String(v)
  } catch {
    return String(v)
  }
}
</script>

<style scoped>
/* ✅ گرید: auto-fill باعث میشه کارت‌ها در هر عرضی درست بشینن */
.product-grid {
  @apply grid gap-4 sm:gap-5 items-stretch;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

/* ✅ کارت: قد یکدست + جذابیت hover */
.product-card {
  @apply h-full rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden
  transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-200
  flex flex-col;
}

/* ✅ مدیا: نسبت ثابت برای جلوگیری از بهم‌ریختگی ابعاد */
.media {
  @apply relative bg-slate-50;
  aspect-ratio: 4 / 3;
}

.media-img {
  @apply h-full w-full object-cover;
}

.media-fallback {
  @apply h-full w-full flex items-center justify-center text-slate-400;
}

/* badge */
.badge {
  @apply absolute top-3 right-3 z-10 rounded-full bg-emerald-600 text-white text-[11px] font-semibold px-3 py-1 shadow;
}

/* content */
.content {
  @apply p-4 flex-1 flex flex-col;
}

.top {
  @apply space-y-2;
}

.meta {
  @apply flex flex-wrap gap-2;
}

.pill {
  @apply inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold border;
}

.pill--digital {
  @apply bg-emerald-50 text-emerald-700 border-emerald-100;
}

.pill--physical {
  @apply bg-slate-50 text-slate-700 border-slate-200;
}

.pill--neutral {
  @apply bg-white text-slate-600 border-slate-200;
}

/* ✅ با min-height تیتر/توضیح، همه کارت‌ها هم‌قدتر می‌شن */
.title {
  @apply text-sm sm:text-[15px] font-bold text-slate-900;
  min-height: 44px;
}

.desc {
  @apply text-sm text-slate-600 leading-relaxed;
  min-height: 40px;
}

.bottom {
  @apply mt-auto pt-3 border-t border-slate-100 flex flex-col gap-3;
}

.pricebox {
  @apply flex items-end justify-between gap-3;
}

.price {
  @apply text-lg font-extrabold text-slate-900;
}

.toman {
  @apply text-xs font-semibold text-slate-500 ms-1;
}

.compare {
  @apply text-[11px] text-slate-500;
}

.btn {
  @apply w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white
  transition hover:bg-slate-800 active:scale-[0.99];
}
</style>
