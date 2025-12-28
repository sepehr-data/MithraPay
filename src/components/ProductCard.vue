<template>
  <!-- ❌ h-full رو حذف کن -->
  <div class="card bg-base-100 shadow-md hover:shadow-lg transition overflow-hidden">
    <figure class="relative aspect-[1/1] overflow-hidden bg-base-200">
      <img
          :src="product.image || 'https://placehold.co/600x400?text=Product'"
          :alt="product.title"
          class="w-full h-full object-cover"
          loading="lazy"
      />

      <span
          v-if="hasDiscount"
          class="absolute left-2 top-2 rounded-full bg-error text-error-content px-2.5 py-1 text-[11px] font-bold shadow"
      >
        {{ discountPercent }}%-
      </span>
    </figure>

    <div class="card-body px-4 py-3 gap-2 flex flex-col">
      <RouterLink
          :to="`/product/${product.slug}`"
          class="card-title text-base leading-6 line-clamp-2"
          :title="product.title"
      >
        {{ product.title }}
      </RouterLink>

      <div class="flex items-center gap-2">
        <RatingStars :value="product.rating || 4.5" />
      </div>

      <div class="flex items-center justify-between gap-2">
        <PriceTag :price="product.price" :compareAt="product.compareAt" />
        <button class="btn btn-primary btn-sm" @click="addToCart">افزودن</button>
      </div>

      <RouterLink
          :to="`/product/${product.slug}`"
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
import PriceTag from './PriceTag.vue'

const props = defineProps<{ product: Product }>()
const cart = useCartStore()

const hasDiscount = computed(() => !!props.product.compareAt && props.product.compareAt > props.product.price)
const discountPercent = computed(() => {
  if (!hasDiscount.value) return 0
  const price = props.product.price || 0
  const compare = props.product.compareAt || 0
  if (compare <= 0) return 0
  return Math.round(((compare - price) / compare) * 100)
})

function addToCart() {
  cart.add(props.product.id, 1)
}
</script>
