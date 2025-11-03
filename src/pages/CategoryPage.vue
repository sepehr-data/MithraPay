<template>
  <Breadcrumbs :crumbs="[{title:'دسته‌بندی'}, {title: catTitle}]" />
  <div class="grid lg:grid-cols-[260px,1fr] gap-6">
    <FiltersSidebar v-model:onlyDigital="onlyDigital" v-model:onlyDiscount="onlyDiscount" />
    <div>
      <SortBar v-model="sort" :total="filtered.length" />
      <ProductGrid :products="paged" />

      <div class="mt-6 flex justify-center">
        <Pagination :page="page" :pages="pages" @update:page="page=$event" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import FiltersSidebar from '@/components/FiltersSidebar.vue'
import ProductGrid from '@/components/ProductGrid.vue'
import SortBar from '@/components/SortBar.vue'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const store = useProductsStore()

const sort = ref('bestselling')
const onlyDigital = ref(false)
const onlyDiscount = ref(false)
const page = ref(1)
const perPage = 12

onMounted(() => store.load(route.params.slug as string))
watch(() => route.params.slug, () => store.load(route.params.slug as string))

const catTitle = computed(() => {
  const slug = route.params.slug as string
  if (slug === 'accounts') return 'اکانت‌ها'
  if (slug === 'gift-cards') return 'گیفت‌کارت'
  return 'محصولات'
})

const filtered = computed(() => {
  let items = store.products.slice()
  if (onlyDigital.value) items = items.filter(p => p.isDigital)
  if (onlyDiscount.value) items = items.filter(p => p.compareAt && p.compareAt > p.price)
  if (sort.value === 'price-asc') items.sort((a,b)=>a.price-b.price)
  if (sort.value === 'price-desc') items.sort((a,b)=>b.price-a.price)
  return items
})

const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)))
const paged = computed(() => {
  const start = (page.value - 1) * perPage
  return filtered.value.slice(start, start + perPage)
})
</script>
