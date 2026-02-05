<template>
  <div class="min-h-screen bg-gradient-to-b from-base-200 via-base-200 to-base-300">
    <div class="max-w-6xl mx-auto w-full px-3 sm:px-4 py-6 sm:py-8 space-y-4 sm:space-y-6">
      <!-- Header / Hero -->
      <header class="relative z-10 rounded-3xl border border-base-300/70 bg-base-100/75 backdrop-blur shadow-xl">
        <div class="p-4 sm:p-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-content grid place-items-center shadow-lg">
                <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2h12l2 7H4l2-7Z" />
                  <path d="M4 9h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z" />
                  <path d="M9 13h6" />
                </svg>
              </div>

              <div>
                <h1 class="text-xl sm:text-2xl font-extrabold">سفارش‌های من</h1>
              </div>
            </div>

            <!-- Quick actions -->
            <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
              <label class="input input-bordered rounded-2xl flex items-center gap-2 bg-base-100/70 w-full sm:w-72">
                <svg viewBox="0 0 24 24" class="w-4 h-4 opacity-60" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 21l-4.3-4.3" />
                  <circle cx="11" cy="11" r="7" />
                </svg>
                <input v-model="query" type="text" class="grow text-sm" placeholder="جستجو در شماره/نام سفارش…" />
              </label>

              <!-- Filter -->
              <div class="w-full sm:w-auto">
                <button
                    ref="filterBtnRef"
                    class="btn rounded-2xl btn-outline w-full sm:w-auto"
                    :class="filterOpen ? 'btn-active' : ''"
                    type="button"
                    @click="toggleFilter"
                >
                  <span class="opacity-80">فیلتر:</span>
                  <span class="font-bold">{{ adminStatusFilterLabel }}</span>
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Stats (بر اساس status اصلی سفارش) -->
          <div class="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="rounded-2xl border border-base-300/70 bg-base-100/70 p-4">
              <p class="text-xs opacity-70">کل سفارش‌ها</p>
              <p class="text-2xl font-extrabold mt-1">{{ orders.length }}</p>
            </div>
            <div class="rounded-2xl border border-base-300/70 bg-base-100/70 p-4">
              <p class="text-xs opacity-70">Paid</p>
              <p class="text-2xl font-extrabold mt-1">{{ stats.paid }}</p>
            </div>
            <div class="rounded-2xl border border-base-300/70 bg-base-100/70 p-4">
              <p class="text-xs opacity-70">Fulfilled</p>
              <p class="text-2xl font-extrabold mt-1">{{ stats.fulfilled }}</p>
            </div>
            <div class="rounded-2xl border border-base-300/70 bg-base-100/70 p-4">
              <p class="text-xs opacity-70">Pending</p>
              <p class="text-2xl font-extrabold mt-1">{{ stats.pending }}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Content card -->
      <section class="relative z-0 rounded-3xl border border-base-300/70 bg-base-100/75 backdrop-blur shadow-xl overflow-hidden">
        <!-- Loading -->
        <div v-if="loading" class="p-4 sm:p-6 space-y-3">
          <div class="flex items-center justify-between">
            <div class="skeleton h-5 w-40 rounded-xl"></div>
            <div class="skeleton h-9 w-28 rounded-2xl"></div>
          </div>

          <div class="grid gap-3">
            <div v-for="i in 5" :key="i" class="rounded-2xl border border-base-300/70 bg-base-100 p-4">
              <div class="flex items-center justify-between gap-3">
                <div class="skeleton h-4 w-28 rounded-lg"></div>
                <div class="skeleton h-6 w-20 rounded-full"></div>
              </div>
              <div class="mt-3 skeleton h-4 w-56 rounded-lg"></div>
              <div class="mt-2 skeleton h-4 w-40 rounded-lg"></div>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="!filteredOrders.length" class="p-8 sm:p-10 text-center">
          <div class="mx-auto w-14 h-14 rounded-2xl bg-base-200 grid place-items-center mb-4">
            <svg viewBox="0 0 24 24" class="w-7 h-7 opacity-70" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2h12l2 7H4l2-7Z" />
              <path d="M4 9h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z" />
              <path d="M9 13h6" />
            </svg>
          </div>
          <p class="font-bold">چیزی پیدا نشد</p>
          <p class="text-sm opacity-70 mt-1">فیلتر و جستجو را بررسی کنید.</p>
          <div class="mt-4 flex justify-center gap-2">
            <button class="btn btn-outline rounded-2xl" @click="resetFilters">پاک کردن فیلترها</button>
            <button class="btn btn-ghost rounded-2xl" @click="refresh">دریافت مجدد</button>
          </div>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Desktop -->
          <div class="hidden md:block">
            <div class="p-4 sm:p-6 border-b border-base-300/60 flex items-center justify-between gap-3">
              <div class="text-sm opacity-70">
                نمایش <span class="font-bold text-base-content">{{ filteredOrders.length }}</span> سفارش
              </div>
              <div class="join">
                <button class="btn btn-sm join-item rounded-l-2xl" :class="sort === 'new' ? 'btn-active' : 'btn-ghost'" @click="sort = 'new'">
                  جدیدترین
                </button>
                <button class="btn btn-sm join-item rounded-r-2xl" :class="sort === 'old' ? 'btn-active' : 'btn-ghost'" @click="sort = 'old'">
                  قدیمی‌ترین
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="table table-zebra w-full text-sm">
                <thead>
                <tr class="bg-base-200">
                  <th class="text-right">نام سفارش</th>
                  <th class="text-right"></th>
                  <th class="text-right">شماره سفارش</th>
                  <th class="text-right">قیمت</th>
                  <th class="text-right">تاریخ</th>
                  <th class="text-right">وضعیت</th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="order in sortedOrders" :key="order.id" class="hover">
                  <!-- اطلاعات سفارش -->
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-2xl bg-base-200 grid place-items-center">
                        <span class="font-mono text-xs opacity-80">#</span>
                      </div>

                      <div class="min-w-0">
                        <div class="font-mono font-bold">{{ order.order_number || "—" }}</div>
                        <div class="text-xs opacity-70 mt-0.5">
                          {{ (order.items?.length ?? 0) }} آیتم
                          <span v-if="order._detailsLoading" class="ml-2 opacity-60">(در حال دریافت…)</span>
                        </div>
                      </div>

                      <button class="btn btn-ghost btn-xs rounded-xl" @click="copy(order.order_number || '')">کپی</button>
                    </div>
                  </td>

                  <!-- نام سفارش -->
                  <td>
                    <div class="max-w-[280px]">
                      <div class="font-semibold truncate" :title="order._orderNameFull || order._orderName">
                        {{ order._orderName || "—" }}
                      </div>
                      <div v-if="order._orderName2" class="text-xs opacity-70 truncate" :title="order._orderNameFull">
                        {{ order._orderName2 }}
                      </div>
                    </div>
                  </td>

                  <!-- شماره سفارش -->
                  <td class="font-mono font-bold">
                    {{ order.order_number || "—" }}
                  </td>

                  <!-- قیمت -->
                  <td class="font-extrabold">
                    {{ formatMoney(order.total_amount, order.currency) }}
                  </td>

                  <!-- تاریخ -->
                  <td>
                    <div class="text-sm">{{ formatDate(order.created_at) }}</div>
                  </td>

                  <!-- وضعیت ادمین -->
                  <td>
                      <span class="badge rounded-full" :class="adminBadgeClass(order.admin_status)">
                        {{ adminLabel(order.admin_status) }}
                      </span>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Mobile -->
          <div class="md:hidden p-3 sm:p-4 space-y-3">
            <div class="flex items-center justify-between gap-3 px-1">
              <div class="text-sm opacity-70">{{ filteredOrders.length }} سفارش</div>
              <div class="join">
                <button class="btn btn-xs join-item rounded-l-2xl" :class="sort === 'new' ? 'btn-active' : 'btn-ghost'" @click="sort = 'new'">
                  جدیدترین
                </button>
                <button class="btn btn-xs join-item rounded-r-2xl" :class="sort === 'old' ? 'btn-active' : 'btn-ghost'" @click="sort = 'old'">
                  قدیمی‌ترین
                </button>
              </div>
            </div>

            <article v-for="order in sortedOrders" :key="order.id" class="rounded-3xl border border-base-300/70 bg-base-100 shadow-sm overflow-hidden">
              <div class="p-4 space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <div class="font-mono font-extrabold">{{ order.order_number || "—" }}</div>
                      <button class="btn btn-ghost btn-xs rounded-xl" @click="copy(order.order_number || '')">کپی</button>
                    </div>
                    <div class="text-xs opacity-70 mt-1">
                      {{ order._orderName || "—" }}
                      <span v-if="order._detailsLoading" class="ml-2 opacity-60">(در حال دریافت…)</span>
                    </div>
                  </div>

                  <span class="badge rounded-full" :class="adminBadgeClass(order.admin_status)">
                    {{ adminLabel(order.admin_status) }}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <div class="rounded-2xl bg-base-200/60 border border-base-300 p-3">
                    <div class="text-xs opacity-70">قیمت</div>
                    <div class="font-extrabold mt-1">{{ formatMoney(order.total_amount, order.currency) }}</div>
                  </div>
                  <div class="rounded-2xl bg-base-200/60 border border-base-300 p-3">
                    <div class="text-xs opacity-70">تاریخ</div>
                    <div class="text-sm mt-1">{{ formatDate(order.created_at) }}</div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <!-- Pagination -->
          <div class="p-4 sm:p-6 border-t border-base-300/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="text-xs sm:text-sm opacity-70">
              نمایش {{ orders.length }} سفارش
              <span v-if="hasMore"> (برای دیدن بقیه، «نمایش بیشتر» را بزن)</span>
            </div>

            <div class="flex gap-2">
              <button class="btn btn-outline rounded-2xl" type="button" @click="refresh" :disabled="loading || loadingMore">
                بروزرسانی
              </button>

              <button v-if="hasMore" class="btn btn-primary rounded-2xl" type="button" @click="loadMore" :disabled="loading || loadingMore">
                <span v-if="loadingMore" class="loading loading-spinner loading-sm"></span>
                نمایش بیشتر
              </button>

              <button v-else class="btn rounded-2xl btn-ghost" type="button" disabled>
                همه سفارش‌ها نمایش داده شد
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Teleported Filter Menu -->
    <Teleport to="body">
      <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 translate-y-1 scale-[0.98]"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-120 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-1 scale-[0.98]"
      >
        <div v-if="filterOpen" class="fixed inset-0 z-[100]">
          <button class="absolute inset-0 w-full h-full cursor-default" @click="closeFilter" aria-label="close" />

          <div class="absolute z-[101] w-52 rounded-2xl border border-base-300 bg-base-100 shadow-xl p-2 origin-top-right" :style="filterMenuStyle">
            <ul class="menu p-0">
              <li><a @click="setAdminStatusFilter('all')">همه</a></li>
              <li><a @click="setAdminStatusFilter('open')">باز</a></li>
              <li><a @click="setAdminStatusFilter('reviewing')">در حال بررسی</a></li>
              <li><a @click="setAdminStatusFilter('closed')">بسته</a></li>
              <li><a @click="setAdminStatusFilter('pending')">Pending</a></li>
            </ul>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from "vue"
import { listMyOrders, getOrder } from "@/services/orders"
import { useToast } from "vue-toastification"
import { http } from "@/services/http"
import type { OrderDto, OrderDetailsDto, OrderItemDto } from "@/types/api_client_types/orders.dto"
import type { AdminStatus, OrderStatus, PaymentStatus } from "@/types/api_client_types/orders.dto"

function normalizeEnum(v: any) {
  return String(v ?? "").trim().toUpperCase()
}

function toAdminStatus(v: any): AdminStatus {
  const s = normalizeEnum(v)
  if (s === "OPEN") return "OPEN"
  if (s === "REVIEWING") return "REVIEWING"
  if (s === "CLOSED") return "CLOSED"
  if (s === "PENDING") return "PENDING" // اگر واقعاً در سیستم داری
  // fallback
  return "OPEN"
}

function toOrderStatus(v: any): OrderStatus {
  const s = normalizeEnum(v)
  if (s === "PENDING") return "PENDING"
  if (s === "PAID") return "PAID"
  if (s === "CANCELLED" || s === "CANCELED") return "CANCELLED"
  if (s === "FULFILLED") return "FULFILLED"
  return "PENDING"
}

function toPaymentStatus(v: any): PaymentStatus {
  const s = normalizeEnum(v)
  if (s === "UNPAID") return "UNPAID"
  if (s === "PAID") return "PAID"
  if (s === "FAILED") return "FAILED"
  return "UNPAID"
}

const toast = useToast()

/** pagination */
const LIMIT = 50
const offset = ref(0)
const hasMore = ref(true)
const loadingMore = ref(false)

type UiOrder = OrderDto & {
  _detailsLoading?: boolean
  _orderName?: string
  _orderName2?: string
  _orderNameFull?: string
  items?: OrderItemDto[] // ممکنه فقط بعد از getOrder بیاد
}

const orders = ref<UiOrder[]>([])
const loading = ref(false)

const query = ref("")
const sort = ref<"new" | "old">("new")
const adminStatusFilter = ref<"all" | "open" | "reviewing" | "closed" | "pending">("all")

/** ---------- Filter dropdown ---------- */
const filterOpen = ref(false)
const filterBtnRef = ref<HTMLButtonElement | null>(null)
const filterMenuStyle = ref<Record<string, string>>({})

function updateFilterMenuPosition() {
  const btn = filterBtnRef.value
  if (!btn) return
  const r = btn.getBoundingClientRect()
  const top = Math.round(r.bottom + 8)
  const right = Math.round(window.innerWidth - r.right)
  filterMenuStyle.value = { top: `${top}px`, right: `${right}px` }
}

function closeFilter() {
  filterOpen.value = false
}
function openFilter() {
  filterOpen.value = true
}
function toggleFilter() {
  filterOpen.value ? closeFilter() : openFilter()
}
function setAdminStatusFilter(v: any) {
  adminStatusFilter.value = v
  closeFilter()
}

function onKeyDown(e: KeyboardEvent) {
  if (!filterOpen.value) return
  if (e.key === "Escape") closeFilter()
}
function onScrollOrResize() {
  if (!filterOpen.value) return
  updateFilterMenuPosition()
}

watch(filterOpen, async (isOpen) => {
  if (!isOpen) return
  await nextTick()
  updateFilterMenuPosition()
  window.addEventListener("keydown", onKeyDown, { passive: true })
  window.addEventListener("resize", onScrollOrResize, { passive: true })
  window.addEventListener("scroll", onScrollOrResize, { passive: true, capture: true })
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown as any)
  window.removeEventListener("resize", onScrollOrResize as any)
  window.removeEventListener("scroll", onScrollOrResize as any, true as any)
})

function normalize(v: any) {
  return String(v ?? "").toLowerCase().trim()
}

/** تاریخ: ISO و "YYYY-MM-DD HH:mm:ss" */
function formatDate(v: any) {
  if (!v) return "—"
  const s = String(v)
  const iso = s.includes(" ") && !s.includes("T") ? s.replace(" ", "T") : s
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return s
  return d.toLocaleString("fa-IR")
}

/** total_amount ممکنه string بیاد */
function formatMoney(amount: any, currency?: any) {
  const n = Number(amount ?? 0)
  if (!Number.isFinite(n)) return "—"
  const cur = String(currency || "IRR").toUpperCase()
  const text = n.toLocaleString("fa-IR", { maximumFractionDigits: 2 })
  return cur === "IRR" ? `${text} ریال` : `${text} ${cur}`
}

/** auth */
function readAnyToken(): string {
  const candidates = [
    localStorage.getItem("auth_token"),
    localStorage.getItem("token"),
    localStorage.getItem("access_token"),
  ].filter(Boolean) as string[]
  if (!candidates.length) return ""
  let token = candidates[0].trim()
  return token.replace(/^Bearer\s+/i, "").trim()
}

function ensureAuthForRequests(): boolean {
  const token = readAnyToken()
  if (!token) {
    toast.error("برای مشاهده سفارش‌ها باید وارد حساب شوید.")
    return false
  }
  localStorage.setItem("access_token", token)
  localStorage.setItem("auth_token", token)
  http.defaults.headers.common["Authorization"] = `Bearer ${token}`
  return true
}

/** build order name from items */
function buildOrderName(order: { items?: OrderItemDto[] }) {
  const items = (order?.items || []) as OrderItemDto[]
  const titles = items
      .map((x) => x.productTitle || x.title || x.name)
      .filter(Boolean)
      .map((t) => String(t).trim())
      .filter(Boolean)

  if (!titles.length) return { line1: "—", line2: "", full: "" }

  const first = titles[0]
  const second = titles[1]
  const more = titles.length - 2

  const line1 =
      more > 0
          ? `${first} ، ${second || ""}`.replace(/ ،\s*$/, "")
          : (second ? `${first} ، ${second}` : first)

  const line2 = more > 0 ? `+ ${more} مورد دیگر` : ""
  const full = titles.join(" ، ")
  return { line1, line2, full }
}

/** admin status mapping (case-insensitive) */
function adminLabel(v: any) {
  const s = normalize(v)
  if (!s) return "—"
  if (s === "open") return "باز"
  if (s === "reviewing") return "در حال بررسی"
  if (s === "closed") return "بسته"
  if (s === "pending") return "Pending"
  return String(v)
}

function adminBadgeClass(v: any) {
  const s = normalize(v)
  if (s === "closed") return "badge-success"
  if (s === "open" || s === "reviewing") return "badge-warning"
  if (s === "pending") return "badge-ghost"
  return "badge-ghost"
}

/** copy */
async function copy(text: string) {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    toast.success("کپی شد")
  } catch {
    toast.error("کپی ناموفق بود")
  }
}

function resetFilters() {
  query.value = ""
  adminStatusFilter.value = "all"
  sort.value = "new"
}

/** concurrency */
async function mapWithConcurrency<T>(
    items: T[],
    limit: number,
    worker: (item: T, index: number) => Promise<void>
) {
  let i = 0
  const runners = new Array(Math.min(limit, items.length)).fill(0).map(async () => {
    while (true) {
      const idx = i++
      if (idx >= items.length) break
      await worker(items[idx], idx)
    }
  })
  await Promise.allSettled(runners)
}

/** ✅ getOrder → merge into row */
async function hydrateOrdersDetails(batch: UiOrder[]) {
  // placeholder
  for (const o of batch) {
    o._detailsLoading = true
    o._orderName = o._orderName ?? ""
    o._orderName2 = o._orderName2 ?? ""
    o._orderNameFull = o._orderNameFull ?? ""
  }

  const CONCURRENCY = 6

  await mapWithConcurrency(batch, CONCURRENCY, async (o) => {
    try {
      const full: OrderDetailsDto = await getOrder(Number(o.id))

      // ✅ merge: بک‌اند snake_case است و صفحه هم همین را می‌خواند
      Object.assign(o, full)

      // ✅ name from items
      const names = buildOrderName(o)
      o._orderName = names.line1
      o._orderName2 = names.line2
      o._orderNameFull = names.full

      // ✅ normalize statuses (ممکنه OPEN / open)
      o.admin_status = toAdminStatus(o.admin_status)
      o.status = toOrderStatus(o.status)
      o.payment_status = toPaymentStatus(o.payment_status)
    } catch (e) {
      // اگر شکست خورد، حداقل نام را از items موجود بساز
      const names = buildOrderName(o)
      o._orderName = names.line1
      o._orderName2 = names.line2
      o._orderNameFull = names.full
    } finally {
      o._detailsLoading = false
    }
  })
}

/** API */
async function fetchOrdersPage(reset: boolean) {
  if (loading.value || loadingMore.value) return
  if (!ensureAuthForRequests()) return

  if (reset) {
    loading.value = true
    orders.value = []
    offset.value = 0
    hasMore.value = true
  } else {
    loadingMore.value = true
  }

  try {
    const batch = await listMyOrders({ limit: LIMIT, offset: offset.value })
    const arr = (batch || []) as UiOrder[]

    orders.value.push(...arr)

    // ✅ ستون‌ها را با getOrder پر می‌کنیم
    hydrateOrdersDetails(arr)

    if (arr.length < LIMIT) hasMore.value = false
    else offset.value += LIMIT
  } catch (err: any) {
    console.error(err)
    const status = err?.response?.status ?? err?.status
    if (status === 401) {
      toast.error("دسترسی غیرمجاز (401). لطفاً دوباره وارد حساب شوید.")
      localStorage.removeItem("auth_token")
      localStorage.removeItem("access_token")
      return
    }
    toast.error(err?.response?.data?.message || err?.message || "خطا در دریافت سفارش‌ها")
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

async function refresh() {
  await fetchOrdersPage(true)
}

async function loadMore() {
  if (!hasMore.value) return
  await fetchOrdersPage(false)
}

/** labels */
const adminStatusFilterLabel = computed(() => {
  if (adminStatusFilter.value === "all") return "همه"
  return adminLabel(adminStatusFilter.value)
})

/** filter + sort */
const filteredOrders = computed(() => {
  const q = normalize(query.value)
  const f = normalize(adminStatusFilter.value)

  return orders.value.filter((o) => {
    const adminS = normalize(o.admin_status)

    const matchAdmin = f === "all" ? true : adminS === f
    if (!matchAdmin) return false
    if (!q) return true

    const inNumber = normalize(o.order_number).includes(q)
    const inName = normalize(o._orderNameFull || o._orderName).includes(q)
    return inNumber || inName
  })
})

const sortedOrders = computed(() => {
  const arr = [...filteredOrders.value]
  arr.sort((a, b) => {
    const ta = new Date(String(a.created_at || "").replace(" ", "T")).getTime() || 0
    const tb = new Date(String(b.created_at || "").replace(" ", "T")).getTime() || 0
    return sort.value === "new" ? tb - ta : ta - tb
  })
  return arr
})

const stats = computed(() => {
  let paid = 0
  let fulfilled = 0
  let pending = 0
  let cancelled = 0

  for (const o of orders.value) {
    const s = normalize(o.status) // PENDING/PAID/FULFILLED/CANCELLED
    if (s === "paid") paid++
    else if (s === "fulfilled") fulfilled++
    else if (s === "cancelled" || s === "canceled") cancelled++
    else pending++
  }

  return { paid, fulfilled, pending, cancelled }
})

onMounted(async () => {
  await fetchOrdersPage(true)
})

/** expose for template */
defineExpose({ refresh, loadMore })
</script>

