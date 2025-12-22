<template>
  <div class="space-y-6" dir="rtl">
    <!-- HERO -->
    <section
        class="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary/95 via-primary/85 to-secondary/80 text-primary-content p-5 sm:p-6 shadow-xl"
    >
      <div class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1.5">
          <p class="text-[10px] uppercase tracking-[0.25em] text-primary-content/70">TICKETS</p>
          <h2 class="text-lg sm:text-2xl font-extrabold">مدیریت تیکت‌های پشتیبانی</h2>
          <p class="mt-1 text-xs sm:text-sm text-primary-content/80">
            بررسی، مدیریت و پاسخ‌گویی به تیکت‌های کاربران سپهر‌باکس.
          </p>
        </div>

        <div class="flex flex-col items-end gap-2 text-[11px] sm:text-xs">
          <div
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-primary-content/80"></span>
            <span>تعداد کل تیکت‌ها:</span>
            <span class="font-bold text-sm">{{ totalTickets }}</span>
          </div>

          <div class="flex flex-wrap justify-end gap-2">
            <div
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-error/80"></span>
              <span>باز:</span>
              <span class="font-bold text-sm">{{ openCount }}</span>
            </div>

            <div
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-warning/80"></span>
              <span>در حال بررسی:</span>
              <span class="font-bold text-sm">{{ pendingCount }}</span>
            </div>

            <div
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-success/80"></span>
              <span>بسته شده:</span>
              <span class="font-bold text-sm">{{ closedCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- فیلتر -->
    <section class="rounded-3xl bg-base-100 border border-base-300/80 p-4 sm:p-5 shadow-sm space-y-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="space-y-1">
          <h3 class="text-sm sm:text-base font-semibold text-base-content">جستجو و فیلتر تیکت‌ها</h3>
        </div>

        <div class="w-full sm:w-72 relative mt-1 sm:mt-0">
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
              v-model="search"
              type="text"
              placeholder="جستجو بر اساس موبایل یا موضوع..."
              class="input input-bordered min-h-0 h-9 w-full pr-8 rounded-2xl text-[11px] py-1 text-right"
          />
        </div>
      </div>

      <div class="flex flex-wrap gap-2 text-[11px] sm:text-xs justify-end">
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

    <!-- لیست -->
    <section class="rounded-3xl border border-base-300 bg-base-100 p-4 sm:p-5 shadow-sm flex-grow" style="min-height:300px;">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-sm sm:text-base">تیکت‌ها</h3>
        <span class="text-[11px] text-base-content/60">{{ filteredTickets.length }} تیکت در این لیست</span>
      </div>

      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
          <tr class="text-xs">
            <th class="text-right">کد</th>
            <th class="text-right">کاربر</th>
            <th class="text-right">موضوع</th>
            <th class="text-right">وضعیت</th>
            <th class="text-right">اقدام</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="t in paginatedTickets" :key="t.id" class="hover:bg-base-200/60">
            <td class="text-[11px] sm:text-xs ltr:font-mono text-right">{{ t.id }}</td>
            <td class="text-[11px] sm:text-xs text-right">{{ t.user }}</td>
            <td class="text-[11px] sm:text-xs truncate max-w-[240px] text-right">{{ t.subject }}</td>
            <td class="text-[11px] sm:text-xs text-right">
                <span class="badge badge-sm whitespace-nowrap" :class="statusBadgeClass(t.status)">
                  {{ statusLabel(t.status) }}
                </span>
            </td>
            <td class="text-right">
              <button class="btn btn-xs btn-ghost text-[11px]" @click.stop="openTicket(t)">
                مشاهده / پاسخ
              </button>
            </td>
          </tr>

          <tr v-if="!paginatedTickets.length">
            <td colspan="5" class="text-center text-[11px] text-base-content/60 py-6">تیکتی با این فیلتر پیدا نشد.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- پیجینیشن -->
    <section class="flex justify-center py-4 mt-auto">
      <div class="btn-group">
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === 1" @click="changePage(1)">&lt;&lt;</button>
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">&lt;</button>
        <button class="btn btn-sm btn-ghost">{{ currentPage }} / {{ totalPages }}</button>
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">&gt;</button>
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === totalPages" @click="changePage(totalPages)">&gt;&gt;</button>
      </div>
    </section>

    <!-- ✅ مودال مینیمال + کوچیک (چپ‌چسب درون کانتینر) -->
    <dialog ref="ticketDialog" class="modal">
      <div class="modal-box max-w-md w-[92vw] rounded-2xl p-4 sm:p-5">
        <!-- Header -->
        <div class="flex items-start justify-between gap-3">
          <!-- Title/Meta -->
          <div class="flex-1 text-right space-y-1">
            <div class="text-xs text-base-content/60">مشاهده / پاسخ</div>
            <h3 class="text-sm sm:text-base font-bold leading-7">
              {{ selectedTicket?.subject || 'تیکت' }}
            </h3>

            <!-- ✅ کد/کاربر: چپ‌چسب داخل مودال -->
            <div v-if="selectedTicket" class="flex flex-wrap justify-start gap-2 pt-1">
              <div class="flex flex-col items-start gap-1 px-3 py-2 rounded-xl border border-base-300 bg-base-100">
                <span class="text-[10px] text-base-content/60">کد تیکت</span>
                <span class="font-mono text-[11px] text-base-content">{{ selectedTicket.id }}</span>
              </div>

              <div class="flex flex-col items-start gap-1 px-3 py-2 rounded-xl border border-base-300 bg-base-100">
                <span class="text-[10px] text-base-content/60">کاربر</span>
                <span class="text-[11px] text-base-content">{{ selectedTicket.user }}</span>
              </div>
            </div>
          </div>

          <!-- Close (همان بالا سمت راست) -->
          <button class="btn btn-sm btn-ghost rounded-xl" @click="closeTicketDialog">✕</button>
        </div>

        <div class="divider my-3"></div>

        <div v-if="selectedTicket" class="space-y-3">
          <!-- وضعیت -->
          <div class="rounded-2xl border border-base-300 p-3">
            <div class="flex items-center justify-between">
              <span class="text-[11px] text-base-content/60">وضعیت فعلی</span>
              <span class="badge badge-sm" :class="statusBadgeClass(selectedTicket.status)">
                {{ statusLabel(selectedTicket.status) }}
              </span>
            </div>

            <!-- ✅ دکمه‌های وضعیت: چپ‌چسب -->
            <div class="mt-2 flex flex-wrap justify-start gap-2">
              <button
                  v-for="opt in statusOptions"
                  :key="opt.value"
                  type="button"
                  class="btn btn-xs rounded-xl"
                  :class="adminStatus === opt.value ? 'btn-primary' : 'btn-ghost'"
                  @click="adminStatus = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- پاسخ -->
          <div class="rounded-2xl border border-base-300 p-3">
            <div class="text-[11px] text-base-content/60 mb-2 text-right">پاسخ ادمین</div>
            <textarea
                v-model="replyText"
                class="textarea textarea-bordered w-full rounded-xl text-[12px] leading-7 text-right"
                rows="4"
                placeholder="متن پاسخ..."
            />
          </div>

          <!-- ✅ دکمه‌ها: چپ‌چسب -->
          <div class="flex justify-start gap-2 pt-1">
            <button
                class="btn btn-sm btn-primary rounded-xl"
                @click="saveTicket"
                :disabled="saving || (!replyText.trim() && adminStatus === selectedTicket.status)"
            >
              <span v-if="!saving">ذخیره</span>
              <span v-else class="loading loading-spinner loading-sm"></span>
            </button>
            <button class="btn btn-sm btn-ghost rounded-xl" @click="closeTicketDialog" :disabled="saving">
              انصراف
            </button>
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
import { computed, ref, watch } from 'vue'

type TicketStatus = 'open' | 'pending' | 'closed'
type Ticket = { id: string; user: string; subject: string; status: TicketStatus }

const search = ref('')
const statusFilter = ref<'all' | TicketStatus>('all')

const tickets = ref<Ticket[]>([
  { id: 'TCK-2001', user: '0912...', subject: 'عدم دریافت ایمیل فعال‌سازی اکانت', status: 'open' },
  { id: 'TCK-2002', user: '0935...', subject: 'سؤال درباره تمدید Apple Music', status: 'pending' },
  { id: 'TCK-2003', user: '0990...', subject: 'پرداخت ناموفق اما مبلغ کسر شده', status: 'open' },
  { id: 'TCK-2004', user: '0911...', subject: 'تغییر ایمیل حساب کاربری', status: 'closed' },
  { id: 'TCK-2005', user: '0937...', subject: 'مشکل در ورود با گوگل', status: 'pending' },
  { id: 'TCK-2006', user: '0901...', subject: 'درخواست لغو و بازگشت وجه', status: 'open' },
])

/** شمارنده‌ها */
const totalTickets = computed(() => tickets.value.length)
const openCount = computed(() => tickets.value.filter(t => t.status === 'open').length)
const pendingCount = computed(() => tickets.value.filter(t => t.status === 'pending').length)
const closedCount = computed(() => tickets.value.filter(t => t.status === 'closed').length)

/** فیلترها */
const filterOptions: { key: 'all' | TicketStatus; label: string }[] = [
  { key: 'all', label: 'همه وضعیت‌ها' },
  { key: 'open', label: 'باز' },
  { key: 'pending', label: 'در حال بررسی' },
  { key: 'closed', label: 'بسته شده' },
]

const filteredTickets = computed(() => {
  const q = search.value.trim().toLowerCase()
  return tickets.value.filter(t => {
    const matchStatus = statusFilter.value === 'all' || t.status === statusFilter.value
    const matchSearch = !q || t.user.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })
})

/** پیجینیشن */
const currentPage = ref(1)
const ticketsPerPage = 5

const totalPages = computed(() => Math.max(1, Math.ceil(filteredTickets.value.length / ticketsPerPage)))

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * ticketsPerPage
  const end = start + ticketsPerPage
  return filteredTickets.value.slice(start, end)
})

function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

watch([search, statusFilter], () => {
  currentPage.value = 1
})

watch(totalPages, () => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
})

/** لیبل/کلاس وضعیت */
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

/** مودال */
const ticketDialog = ref<HTMLDialogElement | null>(null)
const selectedTicket = ref<Ticket | null>(null)

const replyText = ref('')
const adminStatus = ref<TicketStatus>('pending')
const saving = ref(false)

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: 'open', label: 'باز' },
  { value: 'pending', label: 'در حال بررسی' },
  { value: 'closed', label: 'بسته شده' },
]

function openTicket(ticket: Ticket) {
  selectedTicket.value = ticket
  replyText.value = ''
  adminStatus.value = ticket.status
  ticketDialog.value?.showModal()
}

function closeTicketDialog() {
  ticketDialog.value?.close()
  selectedTicket.value = null
  replyText.value = ''
}

async function saveTicket() {
  if (!selectedTicket.value) return
  saving.value = true

  try {
    // API واقعی:
    // await api.updateTicket({ id: selectedTicket.value.id, status: adminStatus.value, reply: replyText.value })

    // دموی لوکال
    const idx = tickets.value.findIndex(t => t.id === selectedTicket.value!.id)
    if (idx !== -1) tickets.value[idx].status = adminStatus.value

    closeTicketDialog()
  } finally {
    saving.value = false
  }
}
</script>
