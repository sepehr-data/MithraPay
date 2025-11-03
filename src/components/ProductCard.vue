<template>
  <div class="card bg-base-100 shadow-md hover:shadow-lg transition">
    <figure class="aspect-[4/3] overflow-hidden bg-base-200">
      <img :src="product.image || 'https://placehold.co/600x400?text=Product'" :alt="product.title" class="object-cover w-full h-full" />
    </figure>
    <div class="card-body gap-2">
      <RouterLink :to="`/product/${product.slug}`" class="card-title text-base">{{ product.title }}</RouterLink>
      <div class="flex items-center gap-2">
        <RatingStars :value="product.rating || 4.5" />
      </div>
      <PriceTag :price="product.price" :compareAt="product.compareAt" />
      <div class="card-actions">
        <button class="btn btn-primary btn-sm" @click="addToCart">افزودن به سبد</button>
        <RouterLink :to="`/product/${product.slug}`" class="btn btn-ghost btn-sm">جزئیات</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/services/types'
import { useCartStore } from '@/stores/cart'
import RatingStars from './RatingStars.vue'
import PriceTag from './PriceTag.vue'

const props = defineProps<{ product: Product }>()
const cart = useCartStore()
function addToCart() {
  cart.add(props.product.id, 1)
}
</script>
