<script setup lang="ts">
import { computed } from 'vue'
import type { RangeKey } from '@/types/dashboard'
import type { TicketListItem } from '@/types/api_client_types/admin.dto'

const props = defineProps<{
  range: RangeKey
  loading?: boolean
  error?: string | null
  tickets: TicketListItem[]
  allLink?: string
}>()

function statusBadgeClass(status: string) {
  const s = String(status).toLowerCase()

  // ✅ رنگ‌ها طبق خواسته:
  if (s === 'open') return 'badge-success'       // سبز
  if (s === 'pending') return 'badge-warning'    // زرد
  if (s === 'closed') return 'badge-ghost'       // خاکستری روشن

  return 'badge-ghost'
}

function toTimeValue(iso: string | null): number {
  if (!iso) return -Infinity
  const t = Date.parse(iso)
  return Number.isFinite(t) ? t : -Infinity
}

// ✅ ترجمه موضوع به فارسی
const subjectLabelMap: Record<string, string> = {
  order: 'سفارش / خرید',
  activation: 'فعال‌سازی',
  billing: 'پرداخت / مالی',
  other: 'سایر موارد',
}

function subjectFa(subject: unknown) {
  const key = String(subject ?? '').toLowerCase().trim()
  return subjectLabelMap[key] ?? String(subject ?? '-')
}

// ✅ تاریخ و ساعت شمسی جداگانه: اول تاریخ بعد ساعت
function formatJalaliParts(iso: string | null): { date: string; time: string } {
  if (!iso) return { date: '-', time: '-' }

  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return { date: String(iso), time: '' }

  const date = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)

  const time = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)

  return { date, time }
}

// ✅ همه تیکت‌ها (مرتب‌شده) را نگه می‌داریم؛ اسکرول کار نمایش ۴تایی را انجام می‌دهد
const sortedTickets = computed(() => {
  const arr = Array.isArray(props.tickets) ? props.tickets : []
  return [...arr].sort((a, b) => toTimeValue(b.created_at) - toTimeValue(a.created_at))
})
</script>

<template>
  <div class="rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
    <div class="p-4 sm:p-5 flex items-center justify-between gap-3">
      <div class="space-y-1">
        <h3 class="font-extrabold text-base-content">تیکت‌های اخیر</h3>
      </div>

      <div class="flex items-center gap-3">
        <RouterLink
            v-if="props.allLink"
            :to="props.allLink"
            class="text-xs font-bold text-primary hover:underline"
        >
          همه تیکت‌ها
        </RouterLink>

        <div v-if="loading" class="loading loading-spinner loading-sm"></div>
      </div>
    </div>

    <div class="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3">
      <div v-if="error" class="alert alert-error text-sm">{{ error }}</div>

      <div
          v-else-if="!loading && sortedTickets.length === 0"
          class="py-8 text-center text-sm text-base-content/70"
      >
        تیکتی برای این بازه وجود ندارد.
      </div>

      <!-- ✅ کانتینر اسکرول: ارتفاع طوری که حدود ۴ آیتم دیده شود -->
      <div
          v-else
          class="space-y-2 overflow-y-auto pr-1"
          style="max-height: 360px;"
      >
        <div
            v-for="t in sortedTickets"
            :key="t.id"
            class="rounded-2xl border border-base-300/70 p-3 bg-base-100/70"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="font-bold text-sm text-base-content truncate">
                {{ subjectFa(t.subject) }}
              </p>

              <!-- ✅ زیر موضوع: اول نام کاربر، بعد تاریخ، بعد ساعت -->
              <p class="text-xs text-base-content/70 mt-1">
                <span>{{ t.name }}</span>
                <span class="mx-1">•</span>
                <span>{{ formatJalaliParts(t.created_at ?? null).date }}</span>
                <span class="mx-1">•</span>
                <span>{{ formatJalaliParts(t.created_at ?? null).time }}</span>
              </p>

              <p v-if="t.orderNumber" class="text-[11px] text-base-content/60 mt-1">
                شماره سفارش: {{ t.orderNumber }}
              </p>
            </div>

            <span class="badge" :class="statusBadgeClass(t.status)">
              {{ t.status }}
            </span>
          </div>
        </div>
      </div>
      <!-- /scroll -->
    </div>
  </div>
</template>
