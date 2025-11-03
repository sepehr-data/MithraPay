<template>
  <div class="drawer drawer-end" :class="{ 'drawer-open': ui.isCartOpen }">
    <input type="checkbox" class="drawer-toggle" v-model="ui.isCartOpen" />
    <div class="drawer-side z-50">
      <label class="drawer-overlay" @click="ui.closeCart()"></label>
      <div class="menu p-4 w-96 min-h-full bg-base-100 border-l border-base-300">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">سبد خرید</h3>
          <button class="btn btn-ghost btn-sm" @click="ui.closeCart()">✕</button>
        </div>

        <div v-if="cart.items.length === 0" class="text-sm opacity-70">سبد خرید شما خالی است.</div>

        <div v-else class="space-y-3">
          <div v-for="line in cart.detailed" :key="line.productId" class="flex items-center gap-3">
            <img :src="line.product.image || 'https://placehold.co/64x64'" class="w-16 h-16 rounded-md object-cover"/>
            <div class="flex-1">
              <div class="font-medium">{{ line.product.title }}</div>
              <div class="text-sm opacity-70">{{ price(line.lineTotal) }}</div>
              <div class="mt-2">
                <QuantityInput v-model="(line as any).qty" @update:model-value="cart.setQty(line.productId, $event)"/>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm" @click="cart.remove(line.productId)">حذف</button>
          </div>

          <div class="divider"></div>
          <div class="flex items-center justify-between">
            <span>جمع کل</span>
            <strong>{{ price(cart.total) }}</strong>
          </div>
          <RouterLink to="/checkout" class="btn btn-primary w-full" @click="ui.closeCart()">ادامه فرایند خرید</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import { useCartStore } from '@/stores/cart'
import { formatToman } from '@/services/currency'
import QuantityInput from './QuantityInput.vue'

const ui = useUiStore()
const cart = useCartStore()
const price = (n: number) => formatToman(n)
</script>
