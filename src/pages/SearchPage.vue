<template>
  <h1 class="text-xl font-bold mb-4">نتایج جستجو</h1>
  <ProductGrid :products="results" />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import ProductGrid from '@/components/ProductGrid.vue'

const route = useRoute()
const store = useProductsStore()
onMounted(() => store.load())
const results = computed(() => {
  const q = String(route.query.q || '').trim()
  if (!q) return store.products
  return store.products.filter(p => p.title.includes(q))
})
</script>
