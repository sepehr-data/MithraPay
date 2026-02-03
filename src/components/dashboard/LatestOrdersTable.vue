<script setup lang="ts">
import { computed } from 'vue'
import type { RangeKey } from '@/types/dashboard'
import type { Order } from '@/types/api_client_types/admin.dto'

const props = defineProps<{
  range: RangeKey
  loading?: boolean
  error?: string | null
  orders: Order[]
  allLink?: string
}>()

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' ' + currency
  } catch {
    return String(amount) + ' ' + currency
  }
}

function paymentBadgeClass(paymentStatus: unknown) {
  const s = String(paymentStatus ?? '').toUpperCase()
  if (s === 'PAID') return 'badge-success'
  if (s === 'FAILED') return 'badge-error'
  return 'badge-warning'
}

// ✅ تاریخ شمسی
function formatJalali(iso: string | null) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return iso // fallback
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * ✅ استخراج نام محصول/محصولات خریداری‌شده
 */
function getProductsLabel(o: any): string {
  const items = Array.isArray(o?.items)
      ? o.items
      : Array.isArray(o?.order_items)
          ? o.order_items
          : Array.isArray(o?.products)
              ? o.products
              : null

  if (items && items.length) {
    const names = items
        .map((it: any) => it?.product_title ?? it?.product_name ?? it?.name ?? it?.title)
        .filter(Boolean)
        .map((x: any) => String(x).trim())
        .filter((x: string) => x.length > 0)

    if (names.length === 0) return '—'
    if (names.length === 1) return names[0]
    return `${names[0]} (+${names.length - 1})`
  }

  const single =
      o?.product_title ?? o?.product_name ?? o?.product?.title ?? o?.product?.name

  return single ? String(single) : '—'
}

// ✅ مرتب‌سازی
function toTimeValue(iso: string | null): number {
  if (!iso) return -Infinity
  const t = Date.parse(iso)
  return Number.isFinite(t) ? t : -Infinity
}

const sortedOrders = computed(() => {
  const arr = Array.isArray(props.orders) ? props.orders : []
  return [...arr].sort((a: any, b: any) => toTimeValue(b.created_at) - toTimeValue(a.created_at))
})
</script>

<template>
  <div class="xl:col-span-2 rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
    <div class="p-4 sm:p-5 flex items-center justify-between gap-3">
      <div class="space-y-1">
        <h3 class="font-extrabold text-base-content">آخرین سفارش‌ها</h3>
      </div>

      <div class="flex items-center gap-3">
        <RouterLink
            v-if="props.allLink"
            :to="props.allLink"
            class="text-xs font-bold text-primary hover:underline"
        >
          همه سفارشات
        </RouterLink>

        <div v-if="loading" class="loading loading-spinner loading-sm"></div>
      </div>
    </div>

    <div class="px-4 sm:px-5 pb-4 sm:pb-5">
      <div v-if="error" class="alert alert-error text-sm">{{ error }}</div>

      <div
          v-else-if="!loading && (!sortedOrders || sortedOrders.length === 0)"
          class="py-8 text-center text-sm text-base-content/70"
      >
        سفارشی برای این بازه وجود ندارد.
      </div>

      <div v-else class="overflow-x-auto">
        <!-- ✅ اسکرول عمودی: حدود ۵ ردیف -->
        <div class="max-h-[360px] overflow-y-auto pr-1">
          <table class="table">
            <thead class="sticky top-0 bg-base-100 z-10">
            <tr>
              <!-- ✅ محصول اول -->
              <th>محصول</th>
              <th> شماره سفارش</th>
              <th>وضعیت پرداخت</th>
              <th>مبلغ</th>
              <!-- ✅ تاریخ آخر -->
              <th>تاریخ</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="o in sortedOrders" :key="o.id">
              <!-- ✅ محصول اول -->
              <td class="text-xs text-base-content/80 max-w-[260px] truncate">
                {{ getProductsLabel(o) }}
              </td>

              <td class="font-mono">{{ o.order_number }}</td>

              <td>
                  <span class="badge" :class="paymentBadgeClass(o.payment_status)">
                    {{ o.payment_status }}
                  </span>
              </td>

              <td class="font-semibold">
                {{ formatMoney(o.total_amount, o.currency) }}
              </td>

              <!-- ✅ تاریخ شمسی -->
              <td class="text-xs text-base-content/70 whitespace-nowrap">
                {{ formatJalali(o.created_at ?? null) }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- /scroll -->
      </div>
    </div>
  </div>
</template>
