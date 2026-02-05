asdaq]ddqwdqwdqdqwd<template>
  <div class="space-y-6" dir="rtl">
    <!-- HERO بالا برای سفارشات -->
    <section
        class="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary/95 via-primary/85 to-secondary/80 text-primary-content p-5 sm:p-6 shadow-xl"
    >
      <div class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1.5">
          <p class="text-[10px] uppercase tracking-[0.25em] text-primary-content/70">ORDERS</p>
          <h2 class="text-lg sm:text-2xl font-extrabold">مدیریت سفارشات</h2>
          <p class="mt-1 text-xs sm:text-sm text-primary-content/80">
            مشاهده، جستجو و مدیریت سفارشات پرداخت‌شده ثبت‌شده در رد اسکای.
          </p>
        </div>

        <div class="flex flex-col items-end gap-2 text-[11px] sm:text-xs">
          <div
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-primary-content/80"></span>
            <span>تعداد کل سفارشات (پرداخت‌شده):</span>
            <span class="font-bold text-sm">{{ totalOrders }}</span>
          </div>
          <div
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-primary-content/80"></span>
            <span>در این لیست:</span>
            <span class="font-bold text-sm">{{ filteredCount }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- فیلتر و جستجو -->
    <section class="rounded-3xl bg-base-100 border border-base-300/80 p-4 sm:p-5 shadow-sm space-y-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="space-y-1">
          <h3 class="text-sm sm:text-base font-semibold text-base-content">جستجو و فیلتر سفارشات</h3>
          <p class="text-[11px] text-base-content/60">
            فقط سفارشات پرداخت‌شده نمایش داده می‌شوند.
          </p>
        </div>

        <div class="w-full sm:w-72 relative">
          <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg class="w-4 h-4 text-base-content/50" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.5" />
              <line
                  x1="15.5"
                  y1="15.5"
                  x2="20"
                  y2="20"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
              />
            </svg>
          </span>
          <input
              v-model="q"
              class="input input-bordered min-h-0 h-9 w-full pr-8 rounded-2xl text-[11px] py-1"
              placeholder="جستجو بر اساس کد سفارش، شماره موبایل یا نام محصول..."
          />
        </div>
      </div>

      <!-- تب‌های فیلتر (ادمینی) -->
      <div class="flex flex-wrap gap-2 text-[11px] sm:text-xs">
        <button
            v-for="opt in filterOptions"
            :key="opt.key"
            type="button"
            class="px-3 py-1 rounded-full border transition-colors whitespace-nowrap"
            :class="
            filterTab === opt.key
              ? 'bg-primary text-primary-content border-primary/70'
              : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'
          "
            @click="filterTab = opt.key"
        >
          {{ opt.label }}
        </button>
      </div>
    </section>

    <!-- لیست سفارش‌ها -->
    <section
        class="rounded-3xl border border-base-300 bg-base-100 p-4 sm:p-5 shadow-sm flex-grow"
        style="min-height: 300px;"
    >
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-sm sm:text-base">سفارشات</h3>
        <span class="text-[11px] sm:text-xs text-base-content/60">{{ filteredCount }} سفارش در این لیست</span>
      </div>

      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
          <tr class="text-xs">
            <th class="text-right">کد</th>
            <th class="text-right">شماره سفارش</th>
            <th class="text-right">موضوع</th>
            <th class="text-right">وضعیت (ادمین)</th>
            <th class="text-right">اقدام</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="o in paginatedOrders" :key="o.id" class="hover:bg-base-200/60">
            <td class="text-[11px] sm:text-xs ltr:font-mono text-right">{{ o.id }}</td>
            <td class="text-[11px] sm:text-xs ltr:font-mono text-right">{{ o.orderNumber || '—' }}</td>

            <td class="text-[11px] sm:text-xs truncate max-w-[240px] text-right">
              {{ orderTopic(o) }}
            </td>

            <!-- ✅ نمایش وضعیت فقط بر اساس adminStatus -->
            <td class="text-[11px] sm:text-xs text-right">
                <span class="badge badge-sm whitespace-nowrap" :class="adminBadgeClass(o.adminStatus)">
                  {{ adminLabel(o.adminStatus) }}
                </span>
            </td>

            <td class="text-right">
              <button class="btn btn-xs btn-ghost text-[11px]" @click.stop="openOrder(o)">مشاهده</button>
            </td>
          </tr>

          <tr v-if="!paginatedOrders.length">
            <td colspan="5" class="text-center text-[11px] text-base-content/60 py-6">
              سفارشی با این فیلتر پیدا نشد.
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- پیجینیشن -->
    <section class="flex justify-center py-4 mt-auto">
      <div class="btn-group">
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === 1" @click="changePage(1)">&lt;&lt;</button>
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
          &lt;
        </button>
        <button class="btn btn-sm btn-ghost">{{ currentPage }} / {{ totalPages }}</button>
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
          &gt;
        </button>
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === totalPages" @click="changePage(totalPages)">
          &gt;&gt;
        </button>
      </div>
    </section>

    <!-- مودال سفارش -->
    <dialog ref="orderDialog" class="modal">
      <div class="modal-box max-w-md w-[92vw] rounded-2xl p-4 sm:p-5">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 text-right space-y-1">
            <div class="text-xs text-base-content/60">موضوع سفارش</div>
            <h3 class="text-sm sm:text-base font-bold leading-7">
              {{ orderTopic(selectedOrder) || 'سفارش' }}
            </h3>

            <div v-if="selectedOrder" class="flex flex-wrap justify-start gap-2 pt-1">
              <div class="flex flex-col items-start gap-1 px-3 py-2 rounded-xl border border-base-300 bg-base-100">
                <span class="text-[10px] text-base-content/60">شماره تلفن</span>
                <span class="text-[11px] text-base-content ltr:font-mono">{{ selectedOrder.userPhone || '—' }}</span>
              </div>

              <div class="flex flex-col items-start gap-1 px-3 py-2 rounded-xl border border-base-300 bg-base-100">
                <span class="text-[10px] text-base-content/60">شماره سفارش</span>
                <span class="text-[11px] text-base-content ltr:font-mono">{{ selectedOrder.orderNumber || '—' }}</span>
              </div>
            </div>
          </div>

          <button class="btn btn-sm btn-ghost rounded-xl" @click="closeOrderDialog">✕</button>
        </div>

        <div class="divider my-3"></div>

        <div v-if="selectedOrder" class="space-y-3">
          <!-- وضعیت ادمین -->
          <div class="rounded-2xl border border-base-300 p-3">
            <div class="flex items-center justify-between">
              <span class="text-[11px] text-base-content/60">وضعیت فعلی (ادمین)</span>
              <span class="badge badge-sm" :class="adminBadgeClass(adminOrderStatus)">
                {{ adminLabel(adminOrderStatus) }}
              </span>
            </div>

            <div class="mt-2 flex flex-wrap justify-start gap-2">
              <button
                  v-for="opt in orderDialogStatusOptions"
                  :key="opt.value"
                  type="button"
                  class="btn btn-xs rounded-xl"
                  :class="adminOrderStatus === opt.value ? 'btn-primary' : 'btn-ghost'"
                  @click="adminOrderStatus = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- جزئیات سفارش -->
          <div class="rounded-2xl border border-base-300 p-3">
            <div class="text-[11px] text-base-content/60 mb-2 text-right">جزئیات</div>
            <textarea
                :value="orderDetailsText(selectedOrder)"
                class="textarea textarea-bordered w-full rounded-xl text-[12px] leading-7 text-right"
                rows="4"
                readonly
            />
          </div>

          <!-- دکمه ذخیره -->
          <div class="flex justify-start gap-2 pt-1">
            <button class="btn btn-sm btn-primary rounded-xl" @click="saveOrder" :disabled="saving">
              ذخیره
              <span v-if="saving" class="loading loading-spinner loading-sm"></span>
            </button>
            <button class="btn btn-sm btn-ghost rounded-xl" @click="closeOrderDialog" :disabled="saving">انصراف</button>
          </div>
        </div>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { fetchAllOrders, updateOrderAdminStatus } from '@/services/admin.ts'

type AdminStatus = 'open' | 'pending' | 'closed'
type FilterTab = 'all' | AdminStatus

interface Order {
  id: number
  orderNumber: string
  userId?: number | null
  userPhone?: string | null
  productTitle: string
  amount: number
  currency?: string | null

  // ✅ معیار اصلی برای نمایش در لیست: paymentStatus === 'PAID'
  paymentStatus?: string | null

  createdAt?: string | null
  updatedAt?: string | null

  // ✅ وضعیت نمایشی/فیلتر: فقط adminStatus
  adminStatus: AdminStatus
}

const orders = ref<Order[]>([])
const q = ref('')
const filterTab = ref<FilterTab>('all')

const currentPage = ref(1)
const ordersPerPage = 5

const filterOptions = [
  { key: 'all', label: 'همه سفارشات' },
  { key: 'open', label: 'باز' },
  { key: 'pending', label: 'در حال بررسی' },
  { key: 'closed', label: 'بسته شده' },
] as const

function normalizePaymentStatus(raw: any): string | null {
  const v = raw?.payment_status ?? raw?.paymentStatus ?? raw?.pay_status ?? null
  const s = String(v ?? '').trim().toUpperCase()
  return s ? s : null
}

/**
 * ✅ اگر admin_status / adminStatus نبود یا خالی بود => open
 */
function normalizeAdminStatus(raw: any): AdminStatus {
  const v = raw?.admin_status ?? raw?.adminStatus
  const s = String(v ?? '').trim().toLowerCase()
  if (s === 'pending') return 'pending'
  if (s === 'closed') return 'closed'
  return 'open'
}

function normalizeOrder(raw: any): Order {
  return {
    id: Number(raw?.id),
    orderNumber: String(raw?.order_number ?? raw?.orderNumber ?? ''),
    userId: (raw?.user_id ?? raw?.userId) ?? null,
    userPhone: String(raw?.user_phone ?? raw?.userPhone ?? raw?.phone ?? '') || null,
    productTitle: String(raw?.product_title ?? raw?.productTitle ?? 'سفارش / خرید'),
    amount: Number(raw?.total_amount ?? raw?.totalAmount ?? raw?.amount ?? 0),
    currency: String(raw?.currency ?? '') || null,
    paymentStatus: normalizePaymentStatus(raw),
    createdAt: raw?.created_at ?? raw?.createdAt ?? null,
    updatedAt: raw?.updated_at ?? raw?.updatedAt ?? null,
    adminStatus: normalizeAdminStatus(raw),
  }
}

/**
 * ✅ فقط سفارشات PAID در لیست
 * (دقیقاً مطابق خواسته: payment_status = PAID)
 */
const paidOrders = computed(() =>
    orders.value.filter(o => (o.paymentStatus ?? '').toUpperCase() === 'PAID')
)

/**
 * ✅ فیلتر و نمایش فقط بر اساس adminStatus
 */
const filtered = computed(() => {
  let base = [...paidOrders.value]

  if (filterTab.value !== 'all') {
    base = base.filter(o => o.adminStatus === filterTab.value)
  }

  if (q.value) {
    const term = q.value.toLowerCase()
    base = base.filter(o =>
        String(o.id).includes(term) ||
        (o.userPhone ?? '').includes(term) ||
        (o.productTitle ?? '').toLowerCase().includes(term) ||
        (o.orderNumber ?? '').toLowerCase().includes(term)
    )
  }

  return base
})

const totalOrders = computed(() => paidOrders.value.length)
const filteredCount = computed(() => filtered.value.length)

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / ordersPerPage)))
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * ordersPerPage
  return filtered.value.slice(start, start + ordersPerPage)
})

function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

watch([q, filterTab], () => {
  currentPage.value = 1
})

function formatPrice(val: number) {
  return new Intl.NumberFormat('fa-IR').format(val) + ' تومان'
}

function orderTopic(o?: Order | null) {
  if (!o) return '—'
  return o.productTitle && o.productTitle.trim() ? o.productTitle : 'سفارش / خرید'
}

function adminLabel(s: AdminStatus) {
  return ({ open: 'باز', pending: 'در حال بررسی', closed: 'بسته شده' } as const)[s]
}
function adminBadgeClass(s: AdminStatus) {
  return ({ open: 'badge-success', pending: 'badge-info', closed: 'badge-ghost' } as const)[s]
}

function orderDetailsText(o: Order) {
  const lines: string[] = []
  lines.push(`شماره سفارش: ${o.orderNumber || '—'}`)
  lines.push(`شماره تلفن: ${o.userPhone || '—'}`)
  lines.push(`مبلغ: ${formatPrice(o.amount)}${o.currency ? ` (${o.currency})` : ''}`)
  lines.push(`وضعیت پرداخت: ${o.paymentStatus || '—'}`)
  if (o.createdAt) lines.push(`ایجاد: ${o.createdAt}`)
  if (o.updatedAt) lines.push(`آخرین بروزرسانی: ${o.updatedAt}`)
  return lines.join('\n')
}

/** مودال */
const orderDialog = ref<HTMLDialogElement | null>(null)
const selectedOrder = ref<Order | null>(null)
const saving = ref(false)

const adminOrderStatus = ref<AdminStatus>('open')
const orderDialogStatusOptions: { value: AdminStatus; label: string }[] = [
  { value: 'open', label: 'باز' },
  { value: 'pending', label: 'در حال بررسی' },
  { value: 'closed', label: 'بسته شده' },
]

function openOrder(order: Order) {
  selectedOrder.value = order
  adminOrderStatus.value = order.adminStatus ?? 'open'
  orderDialog.value?.showModal()
}

function closeOrderDialog() {
  orderDialog.value?.close()
  selectedOrder.value = null
}

async function saveOrder() {
  if (!selectedOrder.value) return
  saving.value = true
  try {
    await updateOrderAdminStatus(selectedOrder.value.id, {
      admin_status: adminOrderStatus.value,
    } as any)

    // آپدیت لیست محلی
    const idx = orders.value.findIndex(o => o.id === selectedOrder.value!.id)
    if (idx !== -1) orders.value[idx].adminStatus = adminOrderStatus.value
    if (selectedOrder.value) selectedOrder.value.adminStatus = adminOrderStatus.value

    closeOrderDialog()
  } catch (err) {
    console.error(err)
    alert('خطا در ذخیره وضعیت سفارش')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const res: any = await fetchAllOrders()
    const list = Array.isArray(res) ? res : res?.orders ?? res?.items ?? res?.data ?? []
    if (Array.isArray(list)) {
      orders.value = list.map(normalizeOrder).filter(o => Number.isFinite(o.id))
      currentPage.value = 1
    }
  } catch (err) {
    console.error('fetchAllOrders failed:', err)
    alert('خطا در دریافت لیست سفارشات')
  }
})
</script>
