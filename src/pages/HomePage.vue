<template>
  <div
      class="min-h-screen bg-no-repeat bg-top bg-cover"
      :style="{ backgroundImage: `url(${bgUrl})` }"
  >
    <section class="mb-10">
      <div class="hero rounded-3xl bg-base-100/90 border border-base-300">
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

    <section class="space-y-6">
      <h2 class="text-xl font-bold">پرفروش‌های این هفته</h2>
      <ProductGrid :products="top" />
    </section>
  </div>
</template>

<script setup lang="ts">
import bgUrl from '@/assets/bg.png' // put bg.png in src/assets
import ProductGrid from '@/components/ProductGrid.vue'
import { useProductsStore } from '@/stores/products'
import { onMounted, computed } from 'vue'

const store = useProductsStore()
onMounted(() => store.load())
const top = computed(() => store.products.slice(0, 8))
</script>
<style>
.home-bg {
  min-height: calc(100vh - 160px); /* optional */
  background-image: url('/bg.png'); /* or url('@/assets/bg.png') if you import in <script setup> */
  background-repeat: no-repeat;
  background-position: top;
  background-size: cover;
}
</style>