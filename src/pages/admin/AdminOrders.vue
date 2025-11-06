<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-xl font-bold">سفارش‌ها</h2>
      <input
          v-model="q"
          type="text"
          class="input input-bordered w-52"
          placeholder="جستجو در کد یا موبایل"
      />
    </div>

    <div class="bg-base-100 rounded-2xl border border-base-300 overflow-x-auto">
      <table class="table w-full">
        <thead>
        <tr>
          <th>کد سفارش</th>
          <th>کاربر</th>
          <th>محصول</th>
          <th>مبلغ</th>
          <th>وضعیت</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="o in filtered" :key="o.id">
          <td class="text-xs">{{ o.id }}</td>
          <td class="text-xs">{{ o.userPhone }}</td>
          <td class="text-xs">{{ o.productTitle }}</td>
          <td class="text-xs">{{ formatPrice(o.amount) }}</td>
          <td>
            <span class="badge badge-sm" :class="o.status === 'paid' ? 'badge-success' : 'badge-ghost'">
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
import { computed, ref } from 'vue'

const orders = ref([
  {
    id: 'ORD-1001',
    userPhone: '09120000000',
    productTitle: 'Apple Music (3 ماهه)',
    amount: 249000,
    status: 'paid',
  },
  {
    id: 'ORD-1002',
    userPhone: '09350000000',
    productTitle: 'iCloud+ (200GB)',
    amount: 189000,
    status: 'pending',
  },
])

const q = ref('')

const filtered = computed(() => {
  if (!q.value) return orders.value
  const t = q.value.toLowerCase()
  return orders.value.filter(
      (o) =>
          o.id.toLowerCase().includes(t) ||
          o.userPhone.toLowerCase().includes(t) ||
          o.productTitle.toLowerCase().includes(t)
  )
})

function formatPrice(val: number) {
  return new Intl.NumberFormat('fa-IR').format(val) + ' تومان'
}
</script>
