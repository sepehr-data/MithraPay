<template>
  <div class="card bg-base-100 shadow-md hover:shadow-lg transition overflow-hidden">
    <figure class="relative aspect-[1/1] overflow-hidden bg-base-200">
      <img
          :src="product.image || 'https://placehold.co/600x400?text=Product'"
          :alt="product.title"
          class="w-full h-full object-cover"
          loading="lazy"
      />

      <!-- ✅ دیجیتال روی عکس -->
      <span
          v-if="isDigital"
          class="absolute left-2 top-2 rounded-full bg-primary text-primary-content px-2.5 py-1 text-[11px] font-bold shadow"
      >
        دیجیتال
      </span>
    </figure>

    <div class="card-body px-4 py-3 gap-2 flex flex-col">
      <RouterLink
          :to="{ name: 'product', params: { id: product.id } }"
          class="card-title text-base leading-6 line-clamp-2"
          :title="product.title"
      >
        {{ product.title }}
      </RouterLink>

      <div class="flex items-center gap-2">
        <RatingStars :value="product.rating || 4.5" />
      </div>

      <!-- ✅ قیمت‌ها (دو خط) + دکمه -->
      <div class="flex items-start justify-between gap-2">
        <div class="flex flex-col items-start leading-tight">
          <!-- خط اول: قیمت قبل -->
          <div v-if="hasDiscount" class="text-xs text-base-content/60 line-through">
            {{ formatToman(compareAt) }}
          </div>

          <!-- خط دوم: قیمت فعلی -->
          <div class="text-base font-extrabold">
            {{ formatToman(price) }}
          </div>

          <!-- (اختیاری) درصد تخفیف کوچک زیرش -->
          <div v-if="hasDiscount" class="mt-1 text-[11px] font-bold text-error">
            {{ discountPercent }}٪ تخفیف
          </div>
        </div>

        <button class="btn btn-primary btn-sm" @click="addToCart">افزودن</button>
      </div>

      <RouterLink
          :to="{ name: 'product', params: { id: product.id } }"
          class="btn btn-ghost btn-sm self-end justify-end text-right mt-auto"
      >
        جزئیات
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/services/types'
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import RatingStars from './RatingStars.vue'

const props = defineProps<{ product: Product }>()
const cart = useCartStore()

/** ✅ عددسازی مقاوم */
function toNumber(v: any): number {
  if (v === null || v === undefined) return 0
  const s = String(v).trim()
  if (!s) return 0
  const cleaned = s.replace(/[^0-9.\-]/g, '')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

/** ✅ فرمت تومان (ساده) */
function formatToman(n: number) {
  // اگر واحدت ریال/تومان فرق داره، همینجا تنظیم کن
  return `${Math.round(n).toLocaleString('fa-IR')} تومان`
}

const price = computed(() => {
  const p: any = props.product
  return toNumber(p?.price ?? p?.amount ?? 0)
})

const compareAt = computed(() => {
  const p: any = props.product
  // بک‌اند شما compare_at_price می‌فرسته
  return toNumber(p?.compareAt ?? p?.compare_at_price ?? p?.compare_at ?? p?.old_price ?? 0)
})

const hasDiscount = computed(() => compareAt.value > price.value && compareAt.value > 0 && price.value > 0)

const discountPercent = computed(() => {
  if (!hasDiscount.value) return 0
  const pct = Math.round(((compareAt.value - price.value) / compareAt.value) * 100)
  return Math.max(1, Math.min(99, pct))
})

/** ✅ دیجیتال (طبق دیتای شما delivery_type غالباً null بود) */
const isDigital = computed(() => {
  const p: any = props.product
  const dt = String(p?.delivery_type ?? '').toLowerCase()
  if (dt === 'digital') return true
  if (p?.stock === null) return true
  return false
})

function addToCart() {
  cart.add((props.product as any).id, 1)
}
</script>
