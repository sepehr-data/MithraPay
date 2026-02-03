<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { RangeKey } from '@/types/dashboard'
import type { Order } from '@/types/api_client_types/admin.dto'
import { fetchAllOrders } from '@/services/admin'
import { useUsersTotal } from '@/composables/queries/useAdminDashboard'

const props = defineProps<{
  range: RangeKey
  rangeLabel: string
}>()

const usersTotalQ = useUsersTotal()

const loading = ref(false)
const error = ref<string | null>(null)
const orders = ref<Order[]>([])

// ✅ اگر منظورت از "today" سفارش‌های امروز بر اساس updated_at هست:
const RANGE_FIELD: 'updated_at' | 'created_at' = 'updated_at'

function toMs(iso: string | null | undefined): number {
  if (!iso) return NaN
  const t = Date.parse(iso)
  return Number.isFinite(t) ? t : NaN
}

function getRangeMs(key: RangeKey) {
  const now = new Date()

  // شروع امروز (لوکال مرورگر)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime()

  if (key === 'today') {
    return { start: startOfToday, end: startOfToday + 24 * 60 * 60 * 1000 }
  }

  // ✅ RangeKey شما: '7d'
  if (key === '7d') {
    return { start: now.getTime() - 7 * 24 * 60 * 60 * 1000, end: now.getTime() }
  }

  // ✅ RangeKey شما: '30d'
  if (key === '30d') {
    return { start: now.getTime() - 30 * 24 * 60 * 60 * 1000, end: now.getTime() }
  }

  // all
  return { start: -Infinity, end: Infinity }
}

const filteredOrders = computed(() => {
  const { start, end } = getRangeMs(props.range)
  return (orders.value || []).filter(o => {
    const ms = toMs((o as any)?.[RANGE_FIELD])
    if (!Number.isFinite(ms)) return false
    return ms >= start && ms < end
  })
})

const paid = computed(() => {
  return filteredOrders.value.filter(o => String((o as any)?.payment_status ?? '').toUpperCase() === 'PAID').length
})

const unpaid = computed(() => {
  return filteredOrders.value.filter(o => {
    const pay = String((o as any)?.payment_status ?? '').toUpperCase()
    if (pay === 'FAILED') return false
    return pay === 'UNPAID' || pay === 'PENDING' || pay === 'PROCESSING'
  }).length
})

const users = computed(() => Number(usersTotalQ.data.value ?? 0))

async function loadOrders() {
  loading.value = true
  error.value = null
  try {
    const res = await fetchAllOrders()
    orders.value = Array.isArray(res) ? res : []
  } catch (e: any) {
    error.value = e?.message ?? 'خطا در دریافت سفارش‌ها'
    orders.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadOrders)

// لازم نیست با تغییر رنج دوباره از سرور بگیری، ولی اگر می‌خوای همون رفتار قبلی بمونه، اوکیه.
watch(() => props.range, loadOrders)
</script>

<template>
  <section class="grid gap-3 sm:grid-cols-3 text-xs">
    <div v-if="error" class="sm:col-span-3 alert alert-error text-sm">
      {{ error }}
    </div>

    <div
        class="rounded-2xl border border-base-300 bg-base-100 px-4 py-3 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all"
    >
      <div>
        <p class="text-[11px] text-base-content/70">سفارش‌های موفق</p>
        <p class="font-bold text-success text-lg">{{ paid }}</p>
        <p class="text-[10px] text-base-content/60 mt-0.5">
          بر اساس بازه: {{ rangeLabel }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span class="badge badge-success badge-sm">پرداخت شده</span>
        <div v-if="loading" class="loading loading-spinner loading-xs"></div>
      </div>
    </div>

    <div
        class="rounded-2xl border border-base-300 bg-base-100 px-4 py-3 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all"
    >
      <div>
        <p class="text-[11px] text-base-content/70">در انتظار پرداخت</p>
        <p class="font-bold text-warning text-lg">{{ unpaid }}</p>
        <p class="text-[10px] text-base-content/60 mt-0.5">
          سفارش‌های هنوز نهایی نشده
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span class="badge badge-warning badge-sm">در انتظار</span>
        <div v-if="loading" class="loading loading-spinner loading-xs"></div>
      </div>
    </div>

    <div
        class="rounded-2xl border border-base-300 bg-base-100 px-4 py-3 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all"
    >
      <div>
        <p class="text-[11px] text-base-content/70">کاربران ثبت‌شده</p>
        <p class="font-bold text-info text-lg">{{ users }}</p>
        <p class="text-[10px] text-base-content/60 mt-0.5">
          حساب‌های فعال
        </p>
      </div>
      <span class="badge badge-ghost badge-sm">کاربران</span>
    </div>
  </section>
</template>
