<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { RangeKey } from '@/types/dashboard'
import { rangeOptions } from '@/types/dashboard'

import DashboardHero from '@/components/dashboard/DashboardHero.vue'
import DashboardStatsRow from '@/components/dashboard/DashboardStatsRow.vue'
import LatestOrdersTable from '@/components/dashboard/LatestOrdersTable.vue'
import RecentTicketsList from '@/components/dashboard/RecentTicketsList.vue'

// ✅ سرویس‌های خودت
import {
  adminListUsers,
  adminListBanners,
  adminListProducts,
  fetchAllOrders,
  fetchAllTickets,
} from '@/services/admin'

import type {
  Order,
  TicketListItem,
  AdminBannerListItem,
  AdminProductListItem,
} from '@/types/api_client_types/admin.dto'

const selectedRange = ref<RangeKey>('today')

const currentRangeLabel = computed(() => {
  return rangeOptions.find(r => r.key === selectedRange.value)?.label ?? 'امروز'
})

const loading = ref(false)
const error = ref<string | null>(null)

// Data
const usersTotal = ref<number>(0)
const orders = ref<Order[]>([])
const tickets = ref<TicketListItem[]>([])
const banners = ref<AdminBannerListItem[]>([])
const products = ref<AdminProductListItem[]>([])

// ✅ شمارش‌ها طبق خواسته‌ی تو

// 1) تیکت‌های باز = فقط open
const openTicketsCount = computed(() => {
  return tickets.value.filter(t => String(t.status).toLowerCase() === 'open').length
})

// 2) بنرهای فعال = status === 'active'
const activeBannersCount = computed(() => {
  return banners.value.filter(b => String(b.status).toLowerCase() === 'active').length
})

// 3) محصولات موجود = is_active === true
const availableProductsCount = computed(() => {
  return products.value.filter(p => p.is_active === true).length
})

// 4) سفارش‌های موفق = PAID
const successfulOrdersCount = computed(() => {
  return orders.value.filter(o => o.payment_status === 'PAID' || o.status === 'PAID').length
})

// 5) در انتظار پرداخت / در حال پرداخت
const payingOrdersCount = computed(() => {
  return orders.value.filter(o => {
    const status = String(o.status ?? '').toUpperCase()
    const pay = String(o.payment_status ?? '').toUpperCase()

    // حذف موارد شکست‌خورده/کنسل
    if (pay === 'FAILED' || status === 'CANCELLED') return false

    // در انتظار پرداخت
    return pay === 'UNPAID' || status === 'PENDING'
  }).length
})

let reqId = 0
async function fetchDashboard() {
  const id = ++reqId
  loading.value = true
  error.value = null

  try {
    const [usersRes, ordersRes, ticketsRes, bannersRes, productsRes] = await Promise.all([
      adminListUsers({ limit: 1, offset: 0 }),
      fetchAllOrders(),
      fetchAllTickets(),
      adminListBanners(),
      adminListProducts({ limit: 50, offset: 0 }),
    ])

    if (id !== reqId) return

    usersTotal.value = usersRes.pagination?.total ?? 0

    orders.value = Array.isArray(ordersRes) ? ordersRes : []
    tickets.value = Array.isArray(ticketsRes) ? ticketsRes : []
    banners.value = Array.isArray(bannersRes) ? bannersRes : []
    products.value = productsRes?.items ?? []
  } catch (e: any) {
    if (id !== reqId) return
    error.value = e?.message ?? 'خطا در دریافت اطلاعات داشبورد'
    usersTotal.value = 0
    orders.value = []
    tickets.value = []
    banners.value = []
    products.value = []
  } finally {
    if (id === reqId) loading.value = false
  }
}

onMounted(fetchDashboard)
watch(selectedRange, fetchDashboard)
</script>

<template>
  <div class="space-y-6" dir="rtl">
    <DashboardHero
        v-model:range="selectedRange"
        :currentRangeLabel="currentRangeLabel"
    />

    <!-- ✅ اینجا اعداد درست پاس داده می‌شن -->
    <DashboardStatsRow
        :range="selectedRange"
        :rangeLabel="currentRangeLabel"
        :loading="loading"
        :error="error"
        :usersTotal="usersTotal"
        :openTicketsCount="openTicketsCount"
        :activeBannersCount="activeBannersCount"
        :availableProductsCount="availableProductsCount"
        :successfulOrdersCount="successfulOrdersCount"
        :payingOrdersCount="payingOrdersCount"
    />

    <section class="grid gap-4 xl:grid-cols-3">
      <LatestOrdersTable
          :range="selectedRange"
          :loading="loading"
          :error="error"
          :orders="orders"
          allLink="/admin/orders"
      />

      <RecentTicketsList
          :range="selectedRange"
          :loading="loading"
          :error="error"
          :tickets="tickets"
          allLink="/admin/tickets"
      />
    </section>
  </div>
</template>
