<template>
  <h1 class="text-xl font-bold mb-4">سبد خرید</h1>
  <div v-if="cart.items.length===0" class="alert">سبد خرید شما خالی است.</div>
  <div v-else class="grid lg:grid-cols-[1fr,380px] gap-6">
    <div class="space-y-3">
      <div v-for="line in cart.detailed" :key="line.productId" class="card bg-base-100 border border-base-300">
        <div class="card-body flex-row gap-4 items-center">
          <img :src="line.product.image || 'https://placehold.co/96x96'" class="w-24 h-24 rounded-md object-cover"/>
          <div class="flex-1">
            <div class="font-semibold">{{ line.product.title }}</div>
            <div class="text-sm opacity-70">{{ price(line.product.price) }}</div>
            <div class="mt-2"><QuantityInput v-model="(line as any).qty" @update:model-value="cart.setQty(line.productId, $event)"/></div>
          </div>
          <button class="btn btn-ghost btn-sm" @click="cart.remove(line.productId)">حذف</button>
        </div>
      </div>
    </div>
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <div class="flex items-center justify-between">
          <span>جمع کل</span><strong>{{ price(cart.total) }}</strong>
        </div>
        <RouterLink to="/checkout" class="btn btn-primary w-full">ادامه خرید</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { formatToman } from '@/services/currency'
import QuantityInput from '@/components/QuantityInput.vue'

const cart = useCartStore()
const price = (n: number) => formatToman(n)
</script>
