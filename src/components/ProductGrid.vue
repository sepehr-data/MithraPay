<template>
  <div class="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <ProductCard v-for="p in products" :key="p.id" :product="p" />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/services/types'
import ProductCard from './ProductCard.vue'

defineProps<{ products: Product[] }>()
</script>
