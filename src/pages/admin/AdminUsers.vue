<template>
  <div class="space-y-6" dir="rtl">
    <!-- HERO بالا برای کاربران -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary/95 via-primary/85 to-secondary/80 text-primary-content p-5 sm:p-6 shadow-xl">
      <div class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1.5">
          <p class="text-[10px] uppercase tracking-[0.25em] text-primary-content/70">USERS</p>
          <h2 class="text-lg sm:text-2xl font-extrabold">مدیریت کاربران</h2>
          <p class="mt-1 text-xs sm:text-sm text-primary-content/80">مشاهده، جستجو و مدیریت کاربران ثبت‌نام‌شده در سپهر‌باکس.</p>
        </div>

        <!-- باکس‌های آماری کنار هم -->
        <div class="flex flex-col items-end gap-2 text-[11px] sm:text-xs">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-content/80"></span>
            <span>تعداد کل کاربران:</span>
            <span class="font-bold text-sm">{{ totalUsers }}</span>
          </div>
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20">
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
          <h3 class="text-sm sm:text-base font-semibold text-base-content">جستجو و فیلتر کاربران</h3>
        </div>

        <div class="w-full sm:w-72 relative">
          <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg class="w-4 h-4 text-base-content/50" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.5"/>
              <line x1="15.5" y1="15.5" x2="20" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <input v-model="q" class="input input-bordered min-h-0 h-9 w-full pr-8 rounded-2xl text-[11px] py-1" placeholder="جستجو بر اساس ایمیل یا شماره تلفن..."/>
        </div>
      </div>

      <!-- تب‌های فیلتر -->
      <div class="flex flex-wrap gap-2 text-[11px] sm:text-xs">
        <button v-for="opt in filterOptions" :key="opt.key" type="button" class="px-3 py-1 rounded-full border transition-colors"
                :class="filterTab === opt.key ? 'bg-primary text-primary-content border-primary/70' : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'"
                @click="filterTab = opt.key">{{ opt.label }}</button>
      </div>
    </section>

    <!-- لیست کارت‌محور کاربران -->
    <section class="bg-base-100 rounded-3xl border border-base-300 p-4 sm:p-5 shadow-sm space-y-3 flex-grow" style="min-height: 300px;">
      <div class="flex items-center justify-between mb-1">
        <h3 class="font-semibold text-sm sm:text-base">کاربران</h3>
        <span class="text-[11px] sm:text-xs text-base-content/60">{{ filteredCount }} کاربر در این لیست</span>
      </div>

      <!-- اگر کاربری هست -->
      <div v-if="filtered.length" class="grid gap-3 sm:gap-4 md:grid-cols-2">
        <article v-for="u in paginatedUsers" :key="u.id" class="group rounded-2xl border border-base-300 bg-base-100/90 px-3.5 py-3 sm:px-4 sm:py-3.5 flex items-center justify-between gap-3 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 transition-all">
          <!-- اطلاعات اصلی کاربر -->
          <div class="flex items-center gap-3">
            <!-- آواتار -->
            <div class="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-gradient-to-br from-primary/90 to-secondary/80 text-primary-content flex items-center justify-center text-xs sm:text-sm font-bold shadow-sm">
              {{ avatarInitial(u) }}
            </div>

            <div class="flex flex-col gap-0.5">
              <div class="flex items-center gap-2">
                <span v-if="u.full_name" class="text-xs sm:text-sm font-medium text-base-content">{{ u.full_name }}</span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-full bg-base-200/80 text-[10px] sm:text-[11px] text-base-content/70">بدون نام</span>
                <span class="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full bg-base-200 text-[10px] text-base-content/60">ID: {{ u.id }}</span>
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-base-200/70 text-[11px] sm:text-xs">
                <span class="ltr font-mono text-base-content/90">{{ u.phone }}</span>
              </span>
            </div>
          </div>

          <!-- تاریخ و وضعیت ساده -->
          <div class="flex flex-col items-end gap-1 text-[10px] sm:text-[11px]">
            <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-base-200/80 text-base-content/70 whitespace-nowrap">{{ formatDate(u.created_at) }}</span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-base-100 text-base-content/60 border border-dashed border-base-300 group-hover:border-primary/40">
              <span class="w-1 h-1 rounded-full bg-success/70"></span>
              کاربر ثبت‌شده
            </span>
          </div>
        </article>
      </div>

      <!-- اگر هیچ کاربری در فیلتر نبود -->
      <div v-else class="py-10 flex flex-col items-center justify-center gap-2 text-center text-xs text-base-content/60">
        <div class="h-16 w-16 rounded-3xl border border-dashed border-base-300 flex items-center justify-center mb-1">
          <div class="h-8 w-8 rounded-2xl bg-base-200"></div>
        </div>
        <p>کاربری با این شرایط پیدا نشد.</p>
        <p class="text-[11px] text-base-content/50">عبارت جستجو یا فیلتر بالا را تغییر بده تا کاربران بیشتری نمایش داده شوند.</p>
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
import { ref, computed, onMounted, watch } from "vue"
import { adminListUsers } from "@/services/admin"
import type { AdminUserItem } from "@/types/api_client_types/admin.dto.ts"

/* ===================== STATE ===================== */
const users = ref<AdminUserItem[]>([])
const loading = ref(false)
const q = ref("")

type FilterKey = "all" | "named" | "nameless"
const filterTab = ref<FilterKey>("all")
const filterOptions: { key: FilterKey; label: string }[] = [
  { key: "all", label: "همه کاربران" },
  { key: "named", label: "فقط کاربران با نام" },
  { key: "nameless", label: "فقط کاربران بدون نام" },
]

const totalUsers = ref(0)
const currentPage = ref(1)
const limit = 6
const totalPages = computed(() => Math.max(1, Math.ceil(totalUsers.value / limit)))

/* ===================== FETCH USERS ===================== */
async function fetchUsers() {
  loading.value = true
  try {
    const offset = (currentPage.value - 1) * limit
    const res = await adminListUsers({ limit, offset }) // API expects limit + offset
    users.value = res.items
    totalUsers.value = res.pagination.total
  } finally {
    loading.value = false
  }
}

// load users on mount
onMounted(fetchUsers)

// reload users whenever page changes
watch([currentPage], fetchUsers)

/* ===================== FILTERING ON FRONT ===================== */
const filtered = computed(() => {
  let base = [...users.value]

  if (filterTab.value === "named") {
    base = base.filter(u => u.full_name && u.full_name.trim().length > 0)
  } else if (filterTab.value === "nameless") {
    base = base.filter(u => !u.full_name || u.full_name.trim().length === 0)
  }

  if (q.value.trim()) {
    base = base.filter(
        u => u.email?.toLowerCase().includes(q.value.toLowerCase()) || u.phone.includes(q.value)
    )
  }

  return base
})

/* ===================== COUNTS ===================== */
const filteredCount = computed(() => filtered.value.length)

/* ===================== HELPERS ===================== */
const avatarInitial = (u: AdminUserItem) => {
  if (u.full_name && u.full_name.trim().length > 0) return u.full_name.trim().charAt(0)
  return u.phone.charAt(0)
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("fa-IR")

/* ===================== PAGINATION ===================== */
function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

/* ===================== PAGINATED USERS ===================== */
const paginatedUsers = computed(() => filtered.value)
</script>
