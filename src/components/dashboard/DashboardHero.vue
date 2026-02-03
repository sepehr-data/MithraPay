<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { rangeOptions } from '@/types/dashboard'
import type { RangeKey } from '@/types/dashboard'
import { useProductsStore } from '@/stores/products'
import DashboardRangeSelector from './DashboardRangeSelector.vue'
import { useUsersTotal } from '@/composables/queries/useAdminDashboard'

// ✅ بدون تغییر بک: از لیست‌ها می‌گیریم و سمت فرانت می‌شماریم
import { fetchAllOrders, fetchAllTickets, adminListBanners } from '@/services/admin'
import type { Order, TicketListItem, AdminBannerListItem } from '@/types/api_client_types/admin.dto'

const props = defineProps<{
  range: RangeKey
  currentRangeLabel: string
}>()

const emit = defineEmits<{ (e: 'update:range', v: RangeKey): void }>()

// --------------------
// ✅ کاربران (همون کوئری فعلی)
// --------------------
const usersTotalQ = useUsersTotal()
const usersCount = computed(() => Number(usersTotalQ.data.value ?? 0))

// --------------------
// ✅ محصولات (استور)
// --------------------
const productsStore = useProductsStore()

// اگر استور متد fetch داشته باشه، یک بار صداش می‌زنیم تا صفر نمونه
async function ensureProductsLoaded() {
  if ((productsStore.products?.length ?? 0) > 0) return
  const maybeFn = (productsStore as any).fetchProducts || (productsStore as any).fetchAll || (productsStore as any).load
  if (typeof maybeFn === 'function') {
    await maybeFn.call(productsStore)
  }
}

// شمارش محصولات فعال (پوشش boolean/number/string)
const activeProductsCount = computed(() => {
  const arr = Array.isArray(productsStore.products) ? productsStore.products : []
  return arr.filter((p: any) => p?.is_active === true || p?.is_active === 1 || p?.is_active === '1').length
})

// --------------------
// ✅ سفارش‌ها (لیست کامل)
// --------------------
const ordersLoading = ref(false)
const ordersError = ref<string | null>(null)
const orders = ref<Order[]>([])

// برای رنج امروز، از updated_at استفاده می‌کنیم چون داده‌های شما امروز آپدیت شده‌اند
const RANGE_FIELD: 'updated_at' | 'created_at' = 'updated_at'

function toMs(iso: string | null | undefined): number {
  if (!iso) return NaN
  const t = Date.parse(iso)
  return Number.isFinite(t) ? t : NaN
}

function getRangeMs(key: RangeKey) {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime()

  if (key === 'today') {
    return { start: startOfToday, end: startOfToday + 24 * 60 * 60 * 1000 }
  }
  if (key === '7d') {
    return { start: now.getTime() - 7 * 24 * 60 * 60 * 1000, end: now.getTime() }
  }
  if (key === '30d') {
    return { start: now.getTime() - 30 * 24 * 60 * 60 * 1000, end: now.getTime() }
  }
  return { start: -Infinity, end: Infinity } // all
}

const filteredOrders = computed(() => {
  const { start, end } = getRangeMs(props.range)
  const arr = Array.isArray(orders.value) ? orders.value : []
  return arr.filter((o: any) => {
    const ms = toMs(o?.[RANGE_FIELD])
    if (!Number.isFinite(ms)) return false
    return ms >= start && ms < end
  })
})

const totalOrders = computed(() => filteredOrders.value.length)

const paidOrdersCount = computed(() => {
  return filteredOrders.value.filter((o: any) => String(o?.payment_status ?? '').toUpperCase() === 'PAID').length
})

const reviewOrdersCount = computed(() => {
  // در حال بررسی = admin_status pending
  return filteredOrders.value.filter((o: any) => String(o?.admin_status ?? '').toLowerCase() === 'pending').length
})

const successRate = computed(() => {
  const total = totalOrders.value
  if (!total) return 0
  return Math.round((paidOrdersCount.value / total) * 100)
})

const reviewRate = computed(() => {
  const total = totalOrders.value
  if (!total) return 0
  return Math.round((reviewOrdersCount.value / total) * 100)
})

const successRateClamped = computed(() => Math.max(0, Math.min(100, successRate.value)))
const reviewRateClamped = computed(() => Math.max(0, Math.min(100, reviewRate.value)))

// --------------------
// ✅ تیکت‌ها (لیست کامل) -> شمارش admin open
// --------------------
const tickets = ref<TicketListItem[]>([])
const ticketsLoading = ref(false)

const openTicketsCount = computed(() => {
  const arr = Array.isArray(tickets.value) ? tickets.value : []
  return arr.filter((t: any) => {
    const admin = String(t?.admin_status ?? '').toLowerCase()
    const status = String(t?.status ?? '').toLowerCase()
    // اگر بک admin_status ندارد، از status استفاده می‌کنیم
    return admin === 'open' || status === 'open'
  }).length
})

// --------------------
// ✅ بنرها (لیست کامل) -> شمارش active
// --------------------
const banners = ref<AdminBannerListItem[]>([])
const bannersLoading = ref(false)

const activeBannersCount = computed(() => {
  const arr = Array.isArray(banners.value) ? banners.value : []
  return arr.filter((b: any) => String(b?.status ?? '').toLowerCase() === 'active').length
})

// --------------------
// ✅ لود داده‌ها
// --------------------
async function loadOrders() {
  ordersLoading.value = true
  ordersError.value = null
  try {
    const res = await fetchAllOrders()
    orders.value = Array.isArray(res) ? res : []
  } catch (e: any) {
    ordersError.value = e?.message ?? 'خطا در دریافت سفارش‌ها'
    orders.value = []
  } finally {
    ordersLoading.value = false
  }
}

async function loadTickets() {
  ticketsLoading.value = true
  try {
    const res = await fetchAllTickets()
    tickets.value = Array.isArray(res) ? res : []
  } catch {
    tickets.value = []
  } finally {
    ticketsLoading.value = false
  }
}

async function loadBanners() {
  bannersLoading.value = true
  try {
    const res = await adminListBanners()
    banners.value = Array.isArray(res) ? res : []
  } catch {
    banners.value = []
  } finally {
    bannersLoading.value = false
  }
}

async function loadAll() {
  await Promise.all([loadOrders(), loadTickets(), loadBanners(), ensureProductsLoaded()])
}

onMounted(loadAll)

// اگر می‌خوای همیشه تازه‌ترین دیتا رو با تغییر رنج بگیری، نگه دار.
// (لازم نیست چون فیلتر رنج سمت فرانت انجام میشه، ولی مشکلی هم ایجاد نمی‌کنه.)
watch(() => props.range, () => {
  // فقط سفارش‌ها را می‌گیریم چون ممکن است وضعیت‌ها امروز تغییر کنند
  loadOrders()
})

// وضعیت بروزرسانی
const isRefreshing = computed(() => {
  return (
      ordersLoading.value ||
      ticketsLoading.value ||
      bannersLoading.value ||
      usersTotalQ.isFetching.value
  )
})
</script>

<template>
  <section
      class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/95 via-primary/90 to-secondary/80 text-primary-content p-5 sm:p-7 shadow-xl"
  >
    <div class="relative z-10 space-y-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-[10px] uppercase tracking-[0.25em] text-primary-content/70">DASHBOARD</p>
          <h2 class="text-lg sm:text-2xl font-bold mt-1">داشبورد مدیریت سپهر‌باکس</h2>
          <p class="mt-1 text-xs sm:text-sm opacity-80">
            خلاصه وضعیت در یک نگاه
            <span v-if="isRefreshing" class="opacity-80"> · در حال بروزرسانی…</span>
          </p>

          <p v-if="ordersError" class="mt-2 text-[11px] text-error">
            {{ ordersError }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2 text-[11px] sm:text-xs justify-end">
          <DashboardRangeSelector
              :model-value="range"
              :options="rangeOptions"
              @update:modelValue="emit('update:range', $event)"
          />
        </div>
      </div>

      <div class="grid gap-5 md:grid-cols-3 items-start">
        <div class="md:col-span-2 space-y-4">
          <div class="space-y-1">
            <p class="text-xs sm:text-sm font-medium opacity-85">
              وضعیت کلی سفارش‌ها - {{ currentRangeLabel }}
            </p>

            <!-- ✅ تیتر اصلی: تعداد سفارش‌های پرداخت‌شده -->
            <p class="text-3xl sm:text-4xl font-extrabold leading-tight">
              {{ paidOrdersCount }} سفارش پرداخت‌شده
            </p>

            <!-- ✅ متن کمکی -->
            <p class="text-[11px] sm:text-xs opacity-90">
              {{ totalOrders }} کل · {{ reviewOrdersCount }} در حال بررسی
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 text-[11px] sm:text-xs">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span>نرخ موفقیت سفارش‌ها</span>
                <span class="font-semibold">{{ successRateClamped }}%</span>
              </div>
              <div class="h-2 rounded-full bg-primary-content/20 overflow-hidden">
                <div class="h-full bg-primary-content/90" :style="{ width: successRateClamped + '%' }"></div>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span>در حال بررسی</span>
                <span class="font-semibold">{{ reviewOrdersCount }} سفارش</span>
              </div>
              <div class="h-2 rounded-full bg-primary-content/20 overflow-hidden">
                <div class="h-full bg-warning/90" :style="{ width: reviewRateClamped + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-3 text-[11px] sm:text-xs min-w-[170px]">
          <div class="rounded-2xl bg-primary-content/10 px-3 py-2 flex items-center justify-between">
            <span>کاربران</span><span class="font-semibold text-sm">{{ usersCount }}</span>
          </div>

          <!-- ✅ تیکت‌های باز: admin_status=open (یا status=open اگر admin_status نبود) -->
          <div class="rounded-2xl bg-primary-content/10 px-3 py-2 flex items-center justify-between">
            <span>تیکت‌های باز</span><span class="font-semibold text-sm">{{ openTicketsCount }}</span>
          </div>

          <!-- ✅ بنرهای فعال -->
          <div class="rounded-2xl bg-primary-content/10 px-3 py-2 flex items-center justify-between">
            <span>بنرهای فعال</span><span class="font-semibold text-sm">{{ activeBannersCount }}</span>
          </div>

          <!-- ✅ محصولات فعال -->
          <div class="rounded-2xl bg-primary-content/10 px-3 py-2 flex items-center justify-between">
            <span>محصولات</span><span class="font-semibold text-sm">{{ activeProductsCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="pointer-events-none absolute -left-24 -bottom-24 w-64 h-64 rounded-full border border-primary-content/20 opacity-40"></div>
    <div class="pointer-events-none absolute -right-16 -top-16 w-48 h-48 rounded-full border border-primary-content/25 opacity-50"></div>
    <div class="pointer-events-none absolute inset-y-0 left-1/3 w-px bg-gradient-to-b from-primary-content/10 via-primary-content/40 to-primary-content/10 opacity-50"></div>
  </section>
</template>
