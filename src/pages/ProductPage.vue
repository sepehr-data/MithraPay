<template>
  <Breadcrumbs :crumbs="[{title:'محصولات', to:'/category/accounts'}, {title: product?.title || '...' }]" />
  <div v-if="!product" class="skeleton h-64 w-full"></div>
  <div v-else class="grid lg:grid-cols-2 gap-6">
    <div class="rounded-2xl overflow-hidden border border-base-300 bg-base-100">
      <img :src="product.image || 'https://placehold.co/800x600'" class="w-full h-auto" :alt="product.title"/>
    </div>
    <div class="space-y-4">
      <h1 class="text-2xl font-extrabold">{{ product.title }}</h1>
      <RatingStars :value="product.rating || 4.5" />
      <PriceTag :price="product.price" :compareAt="product.compareAt" />
      <p class="opacity-80 leading-7">{{ product.description }}</p>

      <div class="flex items-center gap-3">
        <QuantityInput v-model="qty" />
        <button class="btn btn-primary" @click="add">افزودن به سبد</button>
      </div>

      <div class="alert alert-info mt-4" v-if="product.isDigital">
        <span>تحویل این محصول دیجیتال است (از طریق پنل/ایمیل).</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import PriceTag from '@/components/PriceTag.vue'
import RatingStars from '@/components/RatingStars.vue'
import QuantityInput from '@/components/QuantityInput.vue'

const route = useRoute()
const store = useProductsStore()
const cart = useCartStore()
const qty = ref(1)
const product = ref<any>(null)

onMounted(async () => {
  product.value = await store.find(route.params.slug as string)
})

function add() {
  if (!product.value) return
  cart.add(product.value.id, qty.value)
}
</script>
