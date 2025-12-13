<template>
  <div class="space-y-6" dir="rtl">
    <!-- HERO بالا برای تیکت‌ها -->
    <section
        class="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary/95 via-primary/85 to-secondary/80 text-primary-content p-5 sm:p-6 shadow-xl"
    >
      <div
          class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <!-- عنوان و توضیح -->
        <div class="space-y-1.5">
          <p
              class="text-[10px] uppercase tracking-[0.25em] text-primary-content/70"
          >
            TICKETS
          </p>
          <h2 class="text-lg sm:text-2xl font-extrabold">
            مدیریت تیکت‌های پشتیبانی
          </h2>
          <p class="mt-1 text-xs sm:text-sm text-primary-content/80">
            بررسی، مدیریت و پاسخ‌گویی به تیکت‌های کاربران سپهر‌باکس.
          </p>
        </div>

        <!-- آمار کلی: خط اول کل، خط دوم جزئیات -->
        <div class="flex flex-col items-end gap-2 text-[11px] sm:text-xs">
          <!-- خط اول: تعداد کل -->
          <div
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-primary-content/80"></span>
            <span>تعداد کل تیکت‌ها:</span>
            <span class="font-bold text-sm">
              {{ totalTickets }}
            </span>
          </div>

          <!-- خط دوم: باز / در حال بررسی / بسته شده -->
          <div class="flex flex-wrap justify-end gap-2">
            <div
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-error/80"></span>
              <span>باز:</span>
              <span class="font-bold text-sm">
                {{ openCount }}
              </span>
            </div>
            <div
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-warning/80"></span>
              <span>در حال بررسی:</span>
              <span class="font-bold text-sm">
                {{ pendingCount }}
              </span>
            </div>
            <div
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-success/80"></span>
              <span>بسته شده:</span>
              <span class="font-bold text-sm">
                {{ closedCount }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- دکور بک‌گراند -->
      <div
          class="pointer-events-none absolute -left-24 -bottom-24 w-64 h-64 rounded-full border border-primary-content/20 opacity-40"
      ></div>
      <div
          class="pointer-events-none absolute -right-16 -top-16 w-48 h-48 rounded-full border border-primary-content/25 opacity-50"
      ></div>
    </section>

    <!-- فیلتر و جستجو -->
    <section
        class="rounded-3xl bg-base-100 border border-base-300/80 p-4 sm:p-5 shadow-sm space-y-4"
    >
      <div
          class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div class="space-y-1">
          <h3 class="text-sm sm:text-base font-semibold text-base-content">
            جستجو و فیلتر تیکت‌ها
          </h3>
        </div>

        <!-- سرچ -->
        <div class="w-full sm:w-72 relative mt-1 sm:mt-0">
          <span
              class="pointer-events-none absolute inset-y-0 right-3 flex items-center"
          >
            <svg
                class="w-4 h-4 text-base-content/50"
                viewBox="0 0 24 24"
                fill="none"
            >
              <circle
                  cx="11"
                  cy="11"
                  r="6"
                  stroke="currentColor"
                  stroke-width="1.5"
              />
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
              v-model="search"
              type="text"
              placeholder="جستجو بر اساس موبایل یا موضوع..."
              class="input input-bordered min-h-0 h-9 w-full pr-8 rounded-2xl text-[11px] py-1"
          />
        </div>
      </div>

      <!-- تب‌های فیلتر وضعیت -->
      <div class="flex flex-wrap gap-2 text-[11px] sm:text-xs">
        <button
            v-for="opt in filterOptions"
            :key="opt.key"
            type="button"
            class="px-3 py-1 rounded-full border transition-colors"
            :class="
            statusFilter === opt.key
              ? 'bg-primary text-primary-content border-primary/70'
              : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'
          "
            @click="statusFilter = opt.key"
        >
          {{ opt.label }}
        </button>
      </div>
    </section>

    <!-- کارت‌های خلاصه پایین هرو -->
    <section class="grid gap-3 sm:grid-cols-3 text-xs">
      <div
          class="rounded-2xl border border-base-300 bg-base-100 p-3 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all"
      >
        <div>
          <p class="text-[11px] text-base-content/70">تیکت‌های باز</p>
          <p class="font-bold text-error text-lg">
            {{ openCount }}
          </p>
        </div>
        <span class="badge badge-error badge-sm">باز</span>
      </div>
      <div
          class="rounded-2xl border border-base-300 bg-base-100 p-3 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all"
      >
        <div>
          <p class="text-[11px] text-base-content/70">در حال بررسی</p>
          <p class="font-bold text-warning text-lg">
            {{ pendingCount }}
          </p>
        </div>
        <span class="badge badge-warning badge-sm">در حال بررسی</span>
      </div>
      <div
          class="rounded-2xl border border-base-300 bg-base-100 p-3 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all"
      >
        <div>
          <p class="text-[11px] text-base-content/70">بسته شده</p>
          <p class="font-bold text-success text-lg">
            {{ closedCount }}
          </p>
        </div>
        <span class="badge badge-ghost badge-sm">بسته شده</span>
      </div>
    </section>

    <!-- لیست تیکت‌ها -->
    <section class="rounded-3xl border border-base-300 bg-base-100 p-4 sm:p-5 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-sm sm:text-base">
          لیست تیکت‌ها
        </h3>
        <span class="text-[11px] text-base-content/60">
                    {{ totalTickets }} تیکت در این لیست
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
          <tr class="text-xs">
            <th>کد</th>
            <th>کاربر</th>
            <th>موضوع</th>
            <th>اولویت</th>
            <th>وضعیت</th>
            <th class="text-center">اقدام</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="t in filteredTickets"
              :key="t.id"
              class="hover:bg-base-200/60"
          >
            <td class="text-[11px] sm:text-xs ltr:font-mono">
              {{ t.id }}
            </td>
            <td class="text-[11px] sm:text-xs">
              {{ t.user }}
            </td>
            <td class="text-[11px] sm:text-xs truncate max-w-[180px]">
              {{ t.subject }}
            </td>
            <td class="text-[11px] sm:text-xs">
  <span
      class="badge badge-sm whitespace-nowrap"
      :class="priorityBadgeClass(t.priority)"
  >
    {{ priorityLabel(t.priority) }}
  </span>
            </td>

            <td class="text-[11px] sm:text-xs">
  <span
      class="badge badge-sm whitespace-nowrap"
      :class="statusBadgeClass(t.status)"
  >
    {{ statusLabel(t.status) }}
  </span>
            </td>

            <td class="text-center">
              <button
                  class="btn btn-xs btn-ghost text-[11px]"
                  @click="openTicket(t)"
              >
                مشاهده / پاسخ
              </button>
            </td>
          </tr>

          <tr v-if="!filteredTickets.length">
            <td
                colspan="6"
                class="text-center text-[11px] text-base-content/60 py-6"
            >
              تیکتی با این فیلتر پیدا نشد.
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- مودال نمایش و تغییر وضعیت تیکت -->
    <div
        v-if="selectedTicket"
        class="fixed inset-0 bg-black/40 z-40 flex items-center justify-center"
        @click="selectedTicket = null"
    >
      <div
          class="bg-base-100 rounded-2xl border border-base-300 shadow-xl w-full max-w-md p-4 space-y-3"
          @click.stop
      >
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-semibold text-sm">
              تیکت {{ selectedTicket.id }}
            </h4>
            <p class="text-[11px] text-base-content/60 mt-0.5">
              کاربر: {{ selectedTicket.user }}
            </p>
          </div>
          <button
              class="btn btn-xs btn-ghost"
              @click="selectedTicket = null"
          >
            ✕
          </button>
        </div>

        <p class="text-xs text-base-content/80">
          موضوع: {{ selectedTicket.subject }}
        </p>

        <!-- وضعیت و اولویت + دکمه‌های تغییر وضعیت -->
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2 text-[11px] text-base-content/70">
            <span
                class="badge badge-ghost badge-xs"
                :class="priorityBadgeClass(selectedTicket.priority)"
            >
              اولویت: {{ priorityLabel(selectedTicket.priority) }}
            </span>
            <span
                class="badge badge-ghost badge-xs"
                :class="statusBadgeClass(selectedTicket.status)"
            >
              وضعیت فعلی: {{ statusLabel(selectedTicket.status) }}
            </span>
          </div>

          <div class="flex flex-wrap gap-2 text-[11px]">
            <button
                class="btn btn-xs"
                :class="selectedTicket.status === 'open'
                ? 'btn-error'
                : 'btn-ghost border border-base-300'"
                @click="changeTicketStatus('open')"
            >
              باز
            </button>
            <button
                class="btn btn-xs"
                :class="selectedTicket.status === 'pending'
                ? 'btn-warning'
                : 'btn-ghost border border-base-300'"
                @click="changeTicketStatus('pending')"
            >
              در حال بررسی
            </button>
            <button
                class="btn btn-xs"
                :class="selectedTicket.status === 'closed'
                ? 'btn-success'
                : 'btn-ghost border border-base-300'"
                @click="changeTicketStatus('closed')"
            >
              بسته شده
            </button>
          </div>
        </div>

        <textarea
            class="textarea textarea-bordered textarea-sm w-full mt-3"
            rows="3"
            placeholder="پاسخ خود را بنویسید (دموی فرانت)..."
        ></textarea>

        <div class="flex justify-end gap-2 pt-1">
          <button
              class="btn btn-xs btn-ghost"
              @click="selectedTicket = null"
          >
            بستن
          </button>
          <button
              class="btn btn-xs btn-primary"
              @click="selectedTicket = null"
          >
            ثبت پاسخ (دمو)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type TicketStatus = 'open' | 'pending' | 'closed'
type TicketPriority = 'low' | 'normal' | 'high'

interface Ticket {
  id: string
  user: string
  subject: string
  status: TicketStatus
  priority: TicketPriority
}

// فیلتر و جستجو
const statusFilter = ref<'all' | TicketStatus>('all')
const search = ref('')

// گزینه‌های تب وضعیت
const filterOptions: { key: 'all' | TicketStatus; label: string }[] = [
  { key: 'all',    label: 'همه وضعیت‌ها' },
  { key: 'open',   label: 'باز' },
  { key: 'pending',label: 'در حال بررسی' },
  { key: 'closed', label: 'بسته شده' },
]

// دیتای نمونه تیکت‌ها
const tickets = ref<Ticket[]>([
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
  {
    id: 'TCK-2004',
    user: '0910...',
    subject: 'عدم تطابق مبلغ فاکتور با سفارش',
    status: 'open',
    priority: 'high',
  },
])

const totalTickets = computed(() => tickets.value.length)
const openCount = computed(
    () => tickets.value.filter(t => t.status === 'open').length,
)
const pendingCount = computed(
    () => tickets.value.filter(t => t.status === 'pending').length,
)
const closedCount = computed(
    () => tickets.value.filter(t => t.status === 'closed').length,
)

const filteredTickets = computed(() => {
  return tickets.value.filter(t => {
    const matchStatus =
        statusFilter.value === 'all' || t.status === statusFilter.value

    const q = search.value.trim().toLowerCase()
    const matchSearch =
        !q ||
        t.user.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)

    return matchStatus && matchSearch
  })
})

// نمایش و استایل وضعیت/اولویت
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

const priorityLabel = (priority: TicketPriority) => {
  switch (priority) {
    case 'high':
      return 'بالا'
    case 'normal':
      return 'معمولی'
    case 'low':
      return 'کم'
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

const priorityBadgeClass = (priority: TicketPriority) => {
  switch (priority) {
    case 'high':
      return 'badge-error'
    case 'normal':
      return 'badge-info'
    case 'low':
      return 'badge-ghost'
  }
}

// تیکت انتخاب‌شده برای مودال
const selectedTicket = ref<Ticket | null>(null)
const openTicket = (t: Ticket) => {
  selectedTicket.value = { ...t }
}

// تغییر وضعیت تیکت (فرانت دمو)
const changeTicketStatus = (newStatus: TicketStatus) => {
  if (!selectedTicket.value) return

  const id = selectedTicket.value.id
  const idx = tickets.value.findIndex(t => t.id === id)
  if (idx === -1) return

  // آپدیت در آرایه اصلی
  tickets.value[idx] = {
    ...tickets.value[idx],
    status: newStatus,
  }

  // آپدیت آبجکت انتخاب‌شده
  selectedTicket.value = {
    ...selectedTicket.value,
    status: newStatus,
  }
}
</script>
