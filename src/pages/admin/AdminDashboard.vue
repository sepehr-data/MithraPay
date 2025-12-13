<template>
  <div class="space-y-6">
    <!-- main hero section with separated background -->
    <section
        class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/95 via-primary/90 to-secondary/80 text-primary-content p-5 sm:p-7 shadow-xl"
    >
      <div class="relative z-10 space-y-6">
        <!-- header inside hero -->
        <div
            class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p
                class="text-[10px] uppercase tracking-[0.25em] text-primary-content/70"
            >
              DASHBOARD
            </p>
            <h2 class="text-lg sm:text-2xl font-bold mt-1">
              داشبورد مدیریت سپهر‌باکس
            </h2>
            <p class="mt-1 text-xs sm:text-sm opacity-80">
              خلاصه وضعیت در یک نگاه
            </p>
          </div>


          <!-- quick pills + range selector -->
          <div class="flex flex-wrap gap-2 text-[11px] sm:text-xs justify-end">
            <!-- range options -->
            <div
                class="inline-flex items-center gap-1 rounded-full bg-primary-content/10 border border-primary-content/20 px-1.5 py-1"
            >
              <button
                  v-for="opt in rangeOptions"
                  :key="opt.key"
                  type="button"
                  class="px-2.5 py-0.5 rounded-full border text-[10px] sm:text-[11px] transition-colors"
                  :class="
                  selectedRange === opt.key
                    ? 'bg-primary-content/90 text-primary font-semibold border-primary-content/0'
                    : 'bg-transparent text-primary-content/90 border-transparent hover:bg-primary-content/20'
                "
                  @click="selectedRange = opt.key"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- overview grid inside hero -->
        <div class="grid gap-5 md:grid-cols-3 items-start">
          <!-- left: orders overview -->
          <div class="md:col-span-2 space-y-4">
            <div class="space-y-1">
              <p class="text-xs sm:text-sm font-medium opacity-85">
                وضعیت کلی سفارش‌ها - {{ currentRangeLabel }}
              </p>
              <p class="text-3xl sm:text-4xl font-extrabold leading-tight">
                {{ orders.length }} سفارش ثبت شده
              </p>
              <p class="text-[11px] sm:text-xs opacity-90">
                {{ paidOrdersCount }} پرداخت شده ·
                {{ pendingOrdersCount }} در حال پردازش
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2 text-[11px] sm:text-xs">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span>نرخ موفقیت سفارش‌ها</span>
                  <span class="font-semibold">
                    {{ successRate }}%
                  </span>
                </div>
                <div class="h-2 rounded-full bg-primary-content/20 overflow-hidden">
                  <div
                      class="h-full bg-primary-content/90"
                      :style="{ width: successRate + '%' }"
                  ></div>
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span>در حال پردازش</span>
                  <span class="font-semibold">
                    {{ pendingOrdersCount }} سفارش
                  </span>
                </div>
                <div class="h-2 rounded-full bg-primary-content/20 overflow-hidden">
                  <div
                      class="h-full bg-warning/90"
                      :style="{ width: pendingRate + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- right: mini stats in hero -->
          <div class="space-y-3 text-[11px] sm:text-xs min-w-[170px]">
            <div
                class="rounded-2xl bg-primary-content/10 px-3 py-2 flex items-center justify-between"
            >
              <span>کاربران</span>
              <span class="font-semibold text-sm">
                {{ users.length }}
              </span>
            </div>
            <div
                class="rounded-2xl bg-primary-content/10 px-3 py-2 flex items-center justify-between"
            >
              <span>تیکت‌های باز</span>
              <span class="font-semibold text-sm">
                {{ openTicketsCount }}
              </span>
            </div>
            <div
                class="rounded-2xl bg-primary-content/10 px-3 py-2 flex items-center justify-between"
            >
              <span>بنرهای فعال</span>
              <span class="font-semibold text-sm">
                {{ banners.length }}
              </span>
            </div>
            <div
                class="rounded-2xl bg-primary-content/10 px-3 py-2 flex items-center justify-between"
            >
              <span>محصولات</span>
              <span class="font-semibold text-sm">
                {{ productsCount }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- background shapes -->
      <div
          class="pointer-events-none absolute -left-24 -bottom-24 w-64 h-64 rounded-full border border-primary-content/20 opacity-40"
      ></div>
      <div
          class="pointer-events-none absolute -right-16 -top-16 w-48 h-48 rounded-full border border-primary-content/25 opacity-50"
      ></div>
      <div
          class="pointer-events-none absolute inset-y-0 left-1/3 w-px bg-gradient-to-b from-primary-content/10 via-primary-content/40 to-primary-content/10 opacity-50"
      ></div>
    </section>

    <!-- small stats row under hero -->
    <section class="grid gap-3 sm:grid-cols-3 text-xs">
      <div
          class="rounded-2xl border border-base-300 bg-base-100 px-4 py-3 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all"
      >
        <div>
          <p class="text-[11px] text-base-content/70">سفارش‌های موفق</p>
          <p class="font-bold text-success text-lg">
            {{ paidOrdersCount }}
          </p>
          <p class="text-[10px] text-base-content/60 mt-0.5">
            بر اساس بازه: {{ currentRangeLabel }}
          </p>
        </div>
        <span class="badge badge-success badge-sm">پرداخت شده</span>
      </div>
      <div
          class="rounded-2xl border border-base-300 bg-base-100 px-4 py-3 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all"
      >
        <div>
          <p class="text-[11px] text-base-content/70">در انتظار پرداخت</p>
          <p class="font-bold text-warning text-lg">
            {{ pendingOrdersCount }}
          </p>
          <p class="text-[10px] text-base-content/60 mt-0.5">
            سفارش‌های هنوز نهایی نشده
          </p>
        </div>
        <span class="badge badge-warning badge-sm">در انتظار</span>
      </div>
      <div
          class="rounded-2xl border border-base-300 bg-base-100 px-4 py-3 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all"
      >
        <div>
          <p class="text-[11px] text-base-content/70">کاربران ثبت‌شده</p>
          <p class="font-bold text-info text-lg">
            {{ users.length }}
          </p>
          <p class="text-[10px] text-base-content/60 mt-0.5">
            حساب‌های فعال
          </p>
        </div>
        <span class="badge badge-ghost badge-sm">کاربران</span>
      </div>
    </section>

    <!-- bottom: orders + tickets + quick links -->
    <section class="grid gap-4 xl:grid-cols-3">
      <!-- latest orders -->
      <article
          class="xl:col-span-2 bg-base-100 rounded-2xl border border-base-300 overflow-hidden"
      >
        <div
            class="flex items-center justify-between px-4 py-3 border-b border-base-200 bg-base-100/80"
        >
          <div>
            <h3 class="font-semibold text-sm sm:text-base">
              آخرین سفارش‌ها
            </h3>
          </div>
          <RouterLink
              to="/admin/orders"
              class="text-[11px] sm:text-xs text-primary hover:underline"
          >
            مشاهده همه
          </RouterLink>
        </div>

        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
            <tr class="text-xs">
              <th>کد</th>
              <th>کاربر</th>
              <th>محصول</th>
              <th>وضعیت</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="o in orders.slice(0, 6)"
                :key="o.id"
                class="hover:bg-base-200/60"
            >
              <td class="text-[11px] sm:text-xs ltr:font-mono">
                {{ o.id }}
              </td>
              <td class="text-[11px] sm:text-xs">
                {{ o.user }}
              </td>
              <td class="text-[11px] sm:text-xs truncate max-w-[220px]">
                {{ o.productTitle }}
              </td>
              <td>
                <span
                    class="badge badge-sm"
                    :class="orderBadgeClass(o.status)"
                >
                  {{ orderStatusLabel(o.status) }}
                </span>
              </td>
            </tr>

            <tr v-if="!orders.length">
              <td
                  colspan="4"
                  class="text-center text-[11px] text-base-content/60 py-6"
              >
                سفارشی ثبت نشده است.
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </article>

      <!-- tickets + quick actions -->
      <article
          class="bg-base-100 rounded-2xl border border-base-300 p-4 flex flex-col gap-4"
      >
        <!-- tickets -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-sm sm:text-base">
              تیکت‌های اخیر
            </h3>
            <RouterLink
                to="/admin/tickets"
                class="text-[11px] sm:text-xs text-primary hover:underline"
            >
              مدیریت تیکت‌ها
            </RouterLink>
          </div>

          <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
            <div
                v-for="t in tickets.slice(0, 5)"
                :key="t.id"
                class="rounded-xl border border-base-300 px-3 py-2 flex flex-col gap-1 hover:bg-base-200/60 transition-colors"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="text-[11px] ltr:font-mono text-base-content/80">
                  {{ t.id }}
                </span>
                <span class="badge badge-xs" :class="statusBadgeClass(t.status)">
                  {{ statusLabel(t.status) }}
                </span>
              </div>
              <p class="text-[11px] text-base-content/80 truncate">
                {{ t.subject }}
              </p>
              <p class="text-[10px] text-base-content/60">
                کاربر: {{ t.user }}
              </p>
            </div>

            <p
                v-if="!tickets.length"
                class="text-center text-[11px] text-base-content/60 py-4"
            >
              تیکت فعالی وجود ندارد.
            </p>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProductsStore } from '@/stores/products'

const productsStore = useProductsStore()
const productsCount = computed(() => productsStore.products.length)

// --- range selector (امروز / ۷ روز / ۳۰ روز) ---
type RangeKey = 'today' | '7d' | '30d'

const rangeOptions: { key: RangeKey; label: string }[] = [
  { key: 'today', label: 'امروز' },
  { key: '7d', label: '۷ روز اخیر' },
  { key: '30d', label: '۳۰ روز اخیر' },
]

const selectedRange = ref<RangeKey>('today')

const currentRangeLabel = computed(() => {
  const found = rangeOptions.find(r => r.key === selectedRange.value)
  return found ? found.label : 'امروز'
})

// در نسخه واقعی این‌جا بر اساس selectedRange می‌تونی
// درخواست بک‌اند بزنی و آمار را برای بازه‌ی مورد نظر بگیری.

// fake data
const users = [
  { id: 1, phone: '0912...' },
  { id: 2, phone: '0935...' },
]

const orders = [
  { id: 'ORD-1001', user: '0912...', productTitle: 'Apple Music (3 ماهه)', status: 'paid' },
  { id: 'ORD-1002', user: '0935...', productTitle: 'iCloud+ (200GB)', status: 'pending' },
  { id: 'ORD-1003', user: '0915...', productTitle: 'Apple TV+ (1 ماهه)', status: 'paid' },
]

const banners = [{ id: 'b1' }, { id: 'b2' }]

const paidOrdersCount = computed(
    () => orders.filter(o => o.status === 'paid').length,
)
const pendingOrdersCount = computed(
    () => orders.filter(o => o.status === 'pending').length,
)

const successRate = computed(() => {
  if (!orders.length) return 0
  return Math.round((paidOrdersCount.value / orders.length) * 100)
})

const pendingRate = computed(() => {
  if (!orders.length) return 0
  return Math.round((pendingOrdersCount.value / orders.length) * 100)
})

// tickets mock
type TicketStatus = 'open' | 'pending' | 'closed'

interface Ticket {
  id: string
  user: string
  subject: string
  status: TicketStatus
  priority: 'low' | 'normal' | 'high'
}

const tickets: Ticket[] = [
  {
    id: 'TCK-2001',
    user: '0912...',
    subject: 'عدم دریافت ایمیل فعال‌سازی اکانت',
    status: 'open',
    priority: 'high',
  },
  {
    id: 'TCK-2002',
    user: '0935...',
    subject: 'سؤال درباره تمدید Apple Music',
    status: 'pending',
    priority: 'normal',
  },
  {
    id: 'TCK-2003',
    user: '0915...',
    subject: 'مشکل ورود به iCloud',
    status: 'closed',
    priority: 'normal',
  },
]

const openTicketsCount = computed(
    () => tickets.filter(t => t.status === 'open').length,
)
const pendingTicketsCount = computed(
    () => tickets.filter(t => t.status === 'pending').length,
)

const orderStatusLabel = (status: string) => {
  if (status === 'paid') return 'پرداخت شده'
  if (status === 'pending') return 'در انتظار'
  return status
}

const orderBadgeClass = (status: string) => {
  if (status === 'paid') return 'badge-success'
  if (status === 'pending') return 'badge-warning'
  return 'badge-ghost'
}

const statusLabel = (status: TicketStatus) => {
  switch (status) {
    case 'open':
      return 'باز'
    case 'pending':
      return 'در حال بررسی'
    case 'closed':
      return 'بسته شده'
  }
}

const statusBadgeClass = (status: TicketStatus) => {
  switch (status) {
    case 'open':
      return 'badge-error'
    case 'pending':
      return 'badge-warning'
    case 'closed':
      return 'badge-ghost'
  }
}
</script>
