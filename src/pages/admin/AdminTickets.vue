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
      بررسی، مدیریت و پاسخ‌گویی به تیکت‌های کاربران رد اسکای.
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
      <!-- عنوان و input جستجو -->
  <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
  <div class="space-y-1">
  <h3 class="text-sm sm:text-base font-semibold text-base-content">جستجو و فیلتر تیکت‌ها</h3>
  </div>

  <!-- input جستجو همان جای قبلی باقی می‌ماند -->
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
  placeholder="جستجو بر اساس شماره تلفن یا موضوع..."
  class="input input-bordered min-h-0 h-9 w-full pr-8 rounded-2xl text-[11px] py-1 text-right"
      />
      </div>
      </div>
      <div class="w-full sm:w-72 flex justify-between text-[11px] sm:text-xs mt-2 ml-auto">
      <button
          v-for="opt in filterOptions"
    :key="opt.key"
  type="button"
  class="px-3 py-1 rounded-full border transition-colors whitespace-nowrap"
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
  <td class="text-[11px] sm:text-xs text-right">{{ t.name }}</td>
  <td class="text-[11px] sm:text-xs truncate max-w-[240px] text-right">
      {{ subjectLabel(t.subject) }}
  </td>
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

      <!-- مودال -->
      <dialog ref="ticketDialog" class="modal">
  <div class="modal-box max-w-md w-[92vw] rounded-2xl p-4 sm:p-5">
  <div class="flex items-start justify-between gap-3">
  <div class="flex-1 text-right space-y-1">
  <div class="text-xs text-base-content/60">موضوع درخواست</div>
  <h3 class="text-sm sm:text-base font-bold leading-7">
      {{ subjectLabel(selectedTicket?.subject) || 'تیکت' }}
  </h3>

  <div v-if="selectedTicket" class="flex flex-wrap justify-start gap-2 pt-1">
      <!-- نام کاربر -->
  <div class="flex flex-col items-start gap-1 px-3 py-2 rounded-xl border border-base-300 bg-base-100">
  <span class="text-[10px] text-base-content/60">نام</span>
      <span class="text-[11px] text-base-content">{{ selectedTicket.name }}</span>
  </div>

  <!-- شماره تلفن -->
  <div class="flex flex-col items-start gap-1 px-3 py-2 rounded-xl border border-base-300 bg-base-100">
  <span class="text-[10px] text-base-content/60">شماره تلفن</span>
  <span class="text-[11px] text-base-content">{{ selectedTicket.phone }}</span>
  </div>
  </div>

  </div>

  <button class="btn btn-sm btn-ghost rounded-xl" @click="closeTicketDialog">✕</button>
  </div>

  <div class="divider my-3"></div>

      <div v-if="selectedTicket" class="space-y-3">
      <!-- وضعیت فعلی -->
  <div class="rounded-2xl border border-base-300 p-3">
  <div class="flex items-center justify-between">
  <span class="text-[11px] text-base-content/60">وضعیت فعلی</span>
  <span class="badge badge-sm" :class="statusBadgeClass(selectedTicket.status)">
      {{ statusLabel(selectedTicket.status) }}
  </span>
  </div>

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

  <!-- متن درخواست یا بخش تایید/رد -->
  <div v-if="adminStatus !== 'closed'" class="rounded-2xl border border-base-300 p-3">
  <div class="text-[11px] text-base-content/60 mb-2 text-right">متن درخواست</div>
  <textarea
  v-model="replyText"
  class="textarea textarea-bordered w-full rounded-xl text-[12px] leading-7 text-right"
  rows="4"
  placeholder="متن پاسخ..."
  readonly
  />
  </div>
  <div v-else class="rounded-2xl p-3">
  <div class="text-[11px] text-base-content/60 mb-2 text-right">نتیجه درخواست</div>

  <div class="flex flex-wrap gap-2 justify-start">
  <!-- تایید -->
  <label class="flex-1">
  <input type="radio" value="approved" v-model="finalDecision" class="peer hidden" />
      <div
:class="[
  'cursor-pointer rounded-xl px-3 py-2 text-center text-[12px] transition-all duration-150',
      finalDecision === 'approved'
          ? 'bg-primary text-primary-content border border-primary'
          : 'bg-base-100 border border-base-300 hover:bg-base-200'
]"
  >
  تایید درخواست
  </div>
  </label>

  <!-- رد -->
  <label class="flex-1">
  <input type="radio" value="rejected" v-model="finalDecision" class="peer hidden" />
      <div
:class="[
  'cursor-pointer rounded-xl px-3 py-2 text-center text-[12px] transition-all duration-150',
      finalDecision === 'rejected'
          ? 'bg-error text-primary-content border border-error'
          : 'bg-base-100 border border-base-300 hover:bg-base-200'
]"
  >
  رد درخواست
  </div>
  </label>
  </div>
  </div>

  <!-- دکمه ذخیره/ثبت -->
  <div class="flex justify-start gap-2 pt-1">
  <button
      class="btn btn-sm btn-primary rounded-xl"
@click="saveTicket"
:disabled="saving || (adminStatus === 'closed' && !finalDecision) || (adminStatus !== 'closed' && !replyText.trim())"
      >
      {{ adminStatus === 'closed' ? 'ثبت' : 'ذخیره' }}
  <span v-if="saving" class="loading loading-spinner loading-sm"></span>
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
import { ref, computed, watch, onMounted } from 'vue'
import { fetchAllTickets, getTicket, updateTicket } from '@/services/admin.ts'
import type {
  TicketListItem,
  GetTicketResponse,
  UpdateTicketRequest,
  UpdateTicketResponse
} from '@/types/api_client_types/admin.dto.ts'

type TicketStatus = 'open' | 'pending' | 'closed'

// Ticket type
type Ticket = {
  id: number
  user: string
  name: string
  phone: string
  subject: string
  status: TicketStatus
}

const search = ref('')
const statusFilter = ref<'all' | TicketStatus>('all')
const tickets = ref<Ticket[]>([])

// Stats
const totalTickets = computed(() => tickets.value.length)
const openCount = computed(() => tickets.value.filter(t => t.status === 'open').length)
const pendingCount = computed(() => tickets.value.filter(t => t.status === 'pending').length)
const closedCount = computed(() => tickets.value.filter(t => t.status === 'closed').length)

const filterOptions: { key: 'all' | TicketStatus; label: string }[] = [
  { key: 'all', label: 'همه وضعیت‌ها' },
  { key: 'open', label: 'باز' },
  { key: 'pending', label: 'در حال بررسی' },
  { key: 'closed', label: 'بسته شده' }
]

// Subject labels
const subjectLabelMap: Record<string, string> = {
  order: 'سفارش / خرید',
  activation: 'فعال‌سازی',
  billing: 'پرداخت / مالی',
  other: 'سایر موارد'
}
function subjectLabel(subject?: string) {
  return subjectLabelMap[subject ?? ''] || subject || '—'
}

// ✅ helpers for search
const normalizeQuery = (v: any) => String(v ?? '').trim().toLowerCase()
const onlyDigits = (v: any) => String(v ?? '').replace(/\D/g, '')

// ✅ FIXED: search by phone + subject (code + fa label)
const filteredTickets = computed(() => {
  const qRaw = normalizeQuery(search.value)
  const qDigits = onlyDigits(qRaw)

  return tickets.value.filter((t) => {
    const matchStatus = statusFilter.value === 'all' || t.status === statusFilter.value
    if (!matchStatus) return false

    // اگر چیزی تایپ نشده، فقط فیلتر وضعیت اعمال میشه
    if (!qRaw) return true

    // phone search (digit-based)
    const phoneDigits = onlyDigits(t.phone)
    const matchPhone = qDigits ? phoneDigits.includes(qDigits) : false

    // subject search (both code + fa label)
    const subjectCode = normalizeQuery(t.subject)
    const subjectFa = normalizeQuery(subjectLabel(t.subject))
    const matchSubject = subjectCode.includes(qRaw) || subjectFa.includes(qRaw)

    return matchPhone || matchSubject
  })
})

// Pagination
const currentPage = ref(1)
const ticketsPerPage = 5
const totalPages = computed(() => Math.max(1, Math.ceil(filteredTickets.value.length / ticketsPerPage)))

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * ticketsPerPage
  return filteredTickets.value.slice(start, start + ticketsPerPage)
})

function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

watch([search, statusFilter], () => (currentPage.value = 1))
watch(totalPages, () => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
})

// Status helpers
const statusLabel = (status: TicketStatus) =>
    ({ open: 'باز', pending: 'در حال بررسی', closed: 'بسته شده' }[status])

const statusBadgeClass = (status: TicketStatus) =>
    ({ open: 'badge-error', pending: 'badge-warning', closed: 'badge-ghost' }[status])

// Dialog / ticket details
const ticketDialog = ref<HTMLDialogElement | null>(null)
const selectedTicket = ref<Ticket | null>(null)
const replyText = ref('')
const adminStatus = ref<TicketStatus>('pending')
const saving = ref(false)
const finalDecision = ref<'approved' | 'rejected' | null>(null)

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: 'open', label: 'باز' },
  { value: 'pending', label: 'در حال بررسی' },
  { value: 'closed', label: 'بسته شده' }
]

watch(adminStatus, (newStatus) => {
  if (newStatus !== 'closed') finalDecision.value = null
})

function parseStatus(status: string): TicketStatus {
  const s = String(status ?? '').toLowerCase()
  if (s === 'open') return 'open'
  if (s === 'closed') return 'closed'
  return 'pending'
}

async function openTicket(ticket: Ticket) {
  try {
    const data: GetTicketResponse = await getTicket(ticket.id)
    selectedTicket.value = {
      id: data.id,
      user: data.email,
      name: data.name || data.email,
      phone: data.phone || '',
      subject: data.subject,
      status: parseStatus(data.status)
    }
    replyText.value = data.message || ''
    adminStatus.value = parseStatus(data.status)
    ticketDialog.value?.showModal()
  } catch (err) {
    console.error(err)
    alert('خطا در دریافت جزئیات تیکت')
  }
}

function closeTicketDialog() {
  ticketDialog.value?.close()
  selectedTicket.value = null
  replyText.value = ''
  finalDecision.value = null
}

async function saveTicket() {
  if (!selectedTicket.value) return
  saving.value = true
  try {
    const payload: UpdateTicketRequest = {
      status: adminStatus.value,
      reply: adminStatus.value !== 'closed' ? replyText.value.trim() : undefined,
      ...(adminStatus.value === 'closed' && finalDecision.value
          ? { final_decision: finalDecision.value }
          : {})
    }

    await updateTicket(selectedTicket.value.id, payload)

    // update local list status
    const idx = tickets.value.findIndex(t => t.id === selectedTicket.value!.id)
    if (idx !== -1) tickets.value[idx].status = adminStatus.value

    closeTicketDialog()
  } catch (err) {
    console.error(err)
    alert('خطا در ذخیره تغییرات تیکت')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const data: TicketListItem[] = await fetchAllTickets()
    tickets.value = data.map(t => ({
      id: t.id,
      user: t.email,
      name: t.name || t.email,
      phone: t.phone || '',
      subject: t.subject,
      status: parseStatus(t.status)
    }))
  } catch (err) {
    console.error(err)
    alert('خطا در دریافت لیست تیکت‌ها')
  }
})
</script>

