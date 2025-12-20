<template>
  <div class="space-y-6" dir="rtl">
    <!-- HERO بالا برای تیکت‌ها -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary/95 via-primary/85 to-secondary/80 text-primary-content p-5 sm:p-6 shadow-xl">
      <div class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1.5">
          <p class="text-[10px] uppercase tracking-[0.25em] text-primary-content/70">TICKETS</p>
          <h2 class="text-lg sm:text-2xl font-extrabold">مدیریت تیکت‌های پشتیبانی</h2>
          <p class="mt-1 text-xs sm:text-sm text-primary-content/80">بررسی، مدیریت و پاسخ‌گویی به تیکت‌های کاربران سپهر‌باکس.</p>
        </div>

        <div class="flex flex-col items-end gap-2 text-[11px] sm:text-xs">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-content/80"></span>
            <span>تعداد کل تیکت‌ها:</span>
            <span class="font-bold text-sm">{{ totalTickets }}</span>
          </div>
          <div class="flex flex-wrap justify-end gap-2">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20">
              <span class="w-1.5 h-1.5 rounded-full bg-error/80"></span>
              <span>باز:</span>
              <span class="font-bold text-sm">{{ openCount }}</span>
            </div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20">
              <span class="w-1.5 h-1.5 rounded-full bg-warning/80"></span>
              <span>در حال بررسی:</span>
              <span class="font-bold text-sm">{{ pendingCount }}</span>
            </div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20">
              <span class="w-1.5 h-1.5 rounded-full bg-success/80"></span>
              <span>بسته شده:</span>
              <span class="font-bold text-sm">{{ closedCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- فیلتر و جستجو -->
    <section class="rounded-3xl bg-base-100 border border-base-300/80 p-4 sm:p-5 shadow-sm space-y-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="space-y-1">
          <h3 class="text-sm sm:text-base font-semibold text-base-content">جستجو و فیلتر تیکت‌ها</h3>
        </div>

        <div class="w-full sm:w-72 relative mt-1 sm:mt-0">
          <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg class="w-4 h-4 text-base-content/50" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.5"/>
              <line x1="15.5" y1="15.5" x2="20" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <input v-model="search" type="text" placeholder="جستجو بر اساس موبایل یا موضوع..." class="input input-bordered min-h-0 h-9 w-full pr-8 rounded-2xl text-[11px] py-1"/>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 text-[11px] sm:text-xs">
        <button v-for="opt in filterOptions" :key="opt.key" type="button" class="px-3 py-1 rounded-full border transition-colors" :class="statusFilter === opt.key ? 'bg-primary text-primary-content border-primary/70' : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'" @click="statusFilter = opt.key">{{ opt.label }}</button>
      </div>
    </section>

    <!-- لیست تیکت‌ها -->
    <section class="rounded-3xl border border-base-300 bg-base-100 p-4 sm:p-5 shadow-sm flex-grow" style="min-height: 300px;">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-sm sm:text-base">تیکت‌ها</h3>
        <span class="text-[11px] text-base-content/60">{{ filteredTickets.length }} تیکت در این لیست</span>
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
          <tr v-for="t in paginatedTickets" :key="t.id" class="hover:bg-base-200/60">
            <td class="text-[11px] sm:text-xs ltr:font-mono">{{ t.id }}</td>
            <td class="text-[11px] sm:text-xs">{{ t.user }}</td>
            <td class="text-[11px] sm:text-xs truncate max-w-[180px]">{{ t.subject }}</td>
            <td class="text-[11px] sm:text-xs">
                <span class="badge badge-sm whitespace-nowrap" :class="priorityBadgeClass(t.priority)">
                  {{ priorityLabel(t.priority) }}
                </span>
            </td>
            <td class="text-[11px] sm:text-xs">
                <span class="badge badge-sm whitespace-nowrap" :class="statusBadgeClass(t.status)">
                  {{ statusLabel(t.status) }}
                </span>
            </td>
            <td class="text-center">
              <button class="btn btn-xs btn-ghost text-[11px]" @click="openTicket(t)">مشاهده / پاسخ</button>
            </td>
          </tr>

          <tr v-if="!paginatedTickets.length">
            <td colspan="6" class="text-center text-[11px] text-base-content/60 py-6">تیکتی با این فیلتر پیدا نشد.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- پیجینیشن -->
    <section class="flex justify-center py-4 mt-auto">
      <div class="btn-group">
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === 1" @click="changePage(1)"><<</button>
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === 1" @click="changePage(currentPage - 1)"><</button>
        <button class="btn btn-sm btn-ghost">{{ currentPage }} / {{ totalPages }}</button>
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">></button>
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === totalPages" @click="changePage(totalPages)">>></button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const search = ref('')
const statusFilter = ref<'all' | 'open' | 'pending' | 'closed'>('all')

const tickets = ref([
  { id: 'TCK-2001', user: '0912...', subject: 'عدم دریافت ایمیل فعال‌سازی اکانت', status: 'open', priority: 'high' },
  { id: 'TCK-2002', user: '0935...', subject: 'سؤال درباره تمدید Apple Music', status: 'pending', priority: 'normal' },
])

const totalTickets = computed(() => tickets.value.length)
const openCount = computed(() => tickets.value.filter(t => t.status === 'open').length)
const pendingCount = computed(() => tickets.value.filter(t => t.status === 'pending').length)
const closedCount = computed(() => tickets.value.filter(t => t.status === 'closed').length)

const filteredTickets = computed(() => {
  return tickets.value.filter(t => {
    const matchStatus = statusFilter.value === 'all' || t.status === statusFilter.value
    const q = search.value.trim().toLowerCase()
    const matchSearch = !q || t.user.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })
})

const currentPage = ref(1)
const ticketsPerPage = 5
const totalPages = computed(() => Math.ceil(filteredTickets.value.length / ticketsPerPage))

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * ticketsPerPage
  const end = start + ticketsPerPage
  return filteredTickets.value.slice(start, end)
})

function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// Helper methods for filtering and status display
const filterOptions = [
  { key: 'all', label: 'همه وضعیت‌ها' },
  { key: 'open', label: 'باز' },
  { key: 'pending', label: 'در حال بررسی' },
  { key: 'closed', label: 'بسته شده' },
]

const priorityLabel = (priority: string) => {
  switch (priority) {
    case 'high': return 'بالا'
    case 'normal': return 'معمولی'
    case 'low': return 'کم'
  }
}

const statusLabel = (status: string) => {
  switch (status) {
    case 'open': return 'باز'
    case 'pending': return 'در حال بررسی'
    case 'closed': return 'بسته شده'
  }
}

const priorityBadgeClass = (priority: string) => {
  switch (priority) {
    case 'high': return 'badge-error'
    case 'normal': return 'badge-info'
    case 'low': return 'badge-ghost'
  }
}

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'open': return 'badge-error'
    case 'pending': return 'badge-warning'
    case 'closed': return 'badge-ghost'
  }
}

const openTicket = (ticket: any) => {
  // Open ticket logic goes here
}
</script>
