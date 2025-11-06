<template>
  <div class="space-y-6">
    <h2 class="text-xl font-bold">داشبورد</h2>

    <div class="grid gap-4 md:grid-cols-4">
      <div class="stat bg-base-100 rounded-2xl border border-base-300">
        <div class="stat-title">محصولات</div>
        <div class="stat-value text-primary">{{ productsCount }}</div>
        <div class="stat-desc">در mock store</div>
      </div>
      <div class="stat bg-base-100 rounded-2xl border border-base-300">
        <div class="stat-title">سفارش‌ها</div>
        <div class="stat-value text-secondary">{{ orders.length }}</div>
        <div class="stat-desc">پرداخت تستی</div>
      </div>
      <div class="stat bg-base-100 rounded-2xl border border-base-300">
        <div class="stat-title">کاربران</div>
        <div class="stat-value">{{ users.length }}</div>
        <div class="stat-desc">OTP / موبایلی</div>
      </div>
      <div class="stat bg-base-100 rounded-2xl border border-base-300">
        <div class="stat-title">بنرها</div>
        <div class="stat-value">{{ banners.length }}</div>
        <div class="stat-desc">در صفحه اصلی</div>
      </div>
    </div>

    <div class="bg-base-100 rounded-2xl border border-base-300 p-4">
      <h3 class="font-semibold mb-3">آخرین سفارش‌ها</h3>
      <table class="table w-full">
        <thead>
        <tr>
          <th>کد</th>
          <th>کاربر</th>
          <th>محصول</th>
          <th>وضعیت</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="o in orders.slice(0,5)" :key="o.id">
          <td class="text-xs">{{ o.id }}</td>
          <td class="text-xs">{{ o.user }}</td>
          <td class="text-xs">{{ o.productTitle }}</td>
          <td>
            <span class="badge badge-sm" :class="o.status === 'paid' ? 'badge-success' : ''">
              {{ o.status }}
            </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProductsStore } from '@/stores/products'

const productsStore = useProductsStore()

const productsCount = computed(() => productsStore.products.length)

// fake data for dashboard
const users = [
  { id: 1, phone: '0912...' },
  { id: 2, phone: '0935...' },
]

const orders = [
  { id: 'ORD-1001', user: '0912...', productTitle: 'Apple Music (3 ماهه)', status: 'paid' },
  { id: 'ORD-1002', user: '0935...', productTitle: 'iCloud+ (200GB)', status: 'pending' },
]

const banners = [
  { id: 'b1' },
  { id: 'b2' },
]
</script>
