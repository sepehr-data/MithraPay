<template>
  <h1 class="text-xl font-bold mb-6">تسویه حساب</h1>
  <div class="grid lg:grid-cols-[1fr,380px] gap-6">
    <div class="space-y-4">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <h2 class="font-semibold mb-2">اطلاعات تماس</h2>
          <label class="form-control">
            <span class="label-text">نام و نام خانوادگی</span>
            <input class="input input-bordered" />
          </label>
          <label class="form-control">
            <span class="label-text">ایمیل</span>
            <input class="input input-bordered" type="email" />
          </label>
          <label class="form-control">
            <span class="label-text">تلفن</span>
            <input class="input input-bordered" type="tel" />
          </label>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300" v-if="hasPhysical">
        <div class="card-body">
          <h2 class="font-semibold mb-2">آدرس ارسال</h2>
          <label class="form-control">
            <span class="label-text">آدرس</span>
            <textarea class="textarea textarea-bordered"></textarea>
          </label>
        </div>
      </div>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body space-y-3">
        <h2 class="font-semibold">سفارش شما</h2>
        <div v-for="line in cart.detailed" :key="line.productId" class="flex items-center justify-between text-sm">
          <span class="opacity-80">{{ line.product.title }} × {{ line.qty }}</span>
          <span class="font-medium">{{ price(line.lineTotal) }}</span>
        </div>
        <div class="divider my-2"></div>
        <div class="flex items-center justify-between">
          <span>مجموع</span><strong>{{ price(cart.total) }}</strong>
        </div>
        <button class="btn btn-primary w-full" @click="placeOrder">پرداخت</button>
        <p class="text-xs opacity-70" v-if="allDigital">تحویل آیتم‌های دیجیتال از طریق ایمیل/پنل پس از پرداخت.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/services/types'
import products from '@/mocks/products.json'
import { formatToman } from '@/services/currency'

const cart = useCartStore()
const allDigital = computed(() => cart.detailed.every(l => (l.product as Product).isDigital))
const hasPhysical = computed(() => !allDigital.value)
const price = (n: number) => formatToman(n)

function placeOrder() {
  alert('این یک دموی فرانت‌اند است. پرداخت واقعی متصل نشده است.')
}
</script>
