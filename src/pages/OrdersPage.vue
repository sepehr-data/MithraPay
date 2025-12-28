<template>
  <div class="min-h-screen bg-gradient-to-b from-base-200 via-base-200 to-base-300">
    <div class="max-w-6xl mx-auto w-full px-3 sm:px-4 py-6 sm:py-8 space-y-4 sm:space-y-6">
      <!-- Header / Hero -->
      <header class="relative z-10 rounded-3xl border border-base-300/70 bg-base-100/75 backdrop-blur shadow-xl">
        <div class="p-4 sm:p-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
              <div
                  class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-content grid place-items-center shadow-lg"
              >
                <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2h12l2 7H4l2-7Z" />
                  <path d="M4 9h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z" />
                  <path d="M9 13h6" />
                </svg>
              </div>

              <div>
                <h1 class="text-xl sm:text-2xl font-extrabold">سفارش‌های من</h1>
                <p class="text-sm opacity-70 mt-1">
                  وضعیت سفارش‌ها را ببینید، جزئیات را بررسی کنید و برای محصولات نظر ثبت کنید.
                </p>
              </div>
            </div>

            <!-- Quick actions -->
            <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
              <label class="input input-bordered rounded-2xl flex items-center gap-2 bg-base-100/70 w-full sm:w-72">
                <svg viewBox="0 0 24 24" class="w-4 h-4 opacity-60" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 21l-4.3-4.3" />
                  <circle cx="11" cy="11" r="7" />
                </svg>
                <input v-model="query" type="text" class="grow text-sm" placeholder="جستجو در کد/محصول…" />
              </label>

              <!-- Filter (Teleport dropdown to body - never clipped) -->
              <div class="w-full sm:w-auto">
                <button
                    ref="filterBtnRef"
                    class="btn rounded-2xl btn-outline w-full sm:w-auto"
                    :class="filterOpen ? 'btn-active' : ''"
                    type="button"
                    @click="toggleFilter"
                >
                  <span class="opacity-80">فیلتر:</span>
                  <span class="font-bold">{{ statusFilterLabel }}</span>
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="rounded-2xl border border-base-300/70 bg-base-100/70 p-4">
              <p class="text-xs opacity-70">کل سفارش‌ها</p>
              <p class="text-2xl font-extrabold mt-1">{{ orders.length }}</p>
            </div>
            <div class="rounded-2xl border border-base-300/70 bg-base-100/70 p-4">
              <p class="text-xs opacity-70">پرداخت شده</p>
              <p class="text-2xl font-extrabold mt-1">{{ stats.paid }}</p>
            </div>
            <div class="rounded-2xl border border-base-300/70 bg-base-100/70 p-4">
              <p class="text-xs opacity-70">تکمیل شده</p>
              <p class="text-2xl font-extrabold mt-1">{{ stats.completed }}</p>
            </div>
            <div class="rounded-2xl border border-base-300/70 bg-base-100/70 p-4">
              <p class="text-xs opacity-70">در حال بررسی</p>
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
          <p class="text-sm opacity-70 mt-1">
            اگر سفارشی ثبت کرده‌اید، فیلتر و جستجو را بررسی کنید.
          </p>
          <div class="mt-4 flex justify-center gap-2">
            <button class="btn btn-outline rounded-2xl" @click="resetFilters">پاک کردن فیلترها</button>
          </div>
        </div>

        <!-- Content (Desktop + Mobile) -->
        <div v-else>
          <!-- Desktop -->
          <div class="hidden md:block">
            <div class="p-4 sm:p-6 border-b border-base-300/60 flex items-center justify-between gap-3">
              <div class="text-sm opacity-70">
                نمایش <span class="font-bold text-base-content">{{ filteredOrders.length }}</span> سفارش
              </div>
              <div class="join">
                <button
                    class="btn btn-sm join-item rounded-l-2xl"
                    :class="sort === 'new' ? 'btn-active' : 'btn-ghost'"
                    @click="sort = 'new'"
                >
                  جدیدترین
                </button>
                <button
                    class="btn btn-sm join-item rounded-r-2xl"
                    :class="sort === 'old' ? 'btn-active' : 'btn-ghost'"
                    @click="sort = 'old'"
                >
                  قدیمی‌ترین
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="table table-zebra w-full text-sm">
                <thead>
                <tr class="bg-base-200">
                  <th class="text-right">اطلاعات سفارش</th>
                  <th class="text-right">محصولات</th>
                  <th class="text-right">وضعیت</th>
                  <th class="text-right">تاریخ</th>
                  <th class="text-right">عملیات</th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="order in sortedOrders" :key="order.id" class="hover">
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-2xl bg-base-200 grid place-items-center">
                        <span class="font-mono text-xs opacity-80">#</span>
                      </div>

                      <div class="min-w-0">
                        <div class="font-mono font-bold">{{ order.code }}</div>
                        <div class="text-xs opacity-70 mt-0.5">{{ order.items?.length || 0 }} آیتم</div>
                      </div>

                      <button class="btn btn-ghost btn-xs rounded-xl" @click="copy(order.code)">کپی</button>
                    </div>
                  </td>

                  <td>
                    <div class="flex flex-wrap gap-1">
                        <span
                            v-for="(item, idx) in order.items"
                            :key="idx"
                            class="badge badge-outline rounded-xl"
                            :title="item.productTitle"
                        >
                          {{ truncate(item.productTitle, 18) }} ×{{ item.quantity }}
                        </span>
                    </div>
                  </td>

                  <td>
                      <span class="badge rounded-full" :class="statusBadgeClass(order.status)">
                        {{ statusLabel(order.status) }}
                      </span>
                  </td>

                  <td>
                    <div class="text-sm">{{ formatDate(order.createdAt) }}</div>
                  </td>

                  <td class="space-x-2 space-x-reverse">
                    <button class="btn btn-xs btn-outline rounded-xl" @click="openDetails(order)">
                      مشاهده سفارش
                    </button>
                    <button
                        class="btn btn-xs btn-primary btn-outline rounded-xl"
                        :disabled="!canReview(order.status)"
                        @click="toast.info('این بخش را به صفحه/مودال ثبت نظر وصل کن 😊')"
                    >
                      ثبت نظر
                    </button>
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
                <button
                    class="btn btn-xs join-item rounded-l-2xl"
                    :class="sort === 'new' ? 'btn-active' : 'btn-ghost'"
                    @click="sort = 'new'"
                >
                  جدیدترین
                </button>
                <button
                    class="btn btn-xs join-item rounded-r-2xl"
                    :class="sort === 'old' ? 'btn-active' : 'btn-ghost'"
                    @click="sort = 'old'"
                >
                  قدیمی‌ترین
                </button>
              </div>
            </div>

            <article
                v-for="order in sortedOrders"
                :key="order.id"
                class="rounded-3xl border border-base-300/70 bg-base-100 shadow-sm overflow-hidden"
            >
              <div class="p-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <div class="font-mono font-extrabold">{{ order.code }}</div>
                      <button class="btn btn-ghost btn-xs rounded-xl" @click="copy(order.code)">کپی</button>
                    </div>
                    <div class="text-xs opacity-70 mt-1">{{ formatDate(order.createdAt) }}</div>
                  </div>

                  <span class="badge rounded-full" :class="statusBadgeClass(order.status)">
                    {{ statusLabel(order.status) }}
                  </span>
                </div>

                <div class="mt-3 flex flex-wrap gap-1">
                  <span v-for="(item, idx) in order.items" :key="idx" class="badge badge-outline rounded-xl">
                    {{ truncate(item.productTitle, 16) }} ×{{ item.quantity }}
                  </span>
                </div>

                <div class="mt-4 flex gap-2">
                  <button class="btn btn-sm btn-outline rounded-2xl flex-1" @click="openDetails(order)">
                    مشاهده سفارش
                  </button>
                  <button
                      class="btn btn-sm btn-primary btn-outline rounded-2xl flex-1"
                      :disabled="!canReview(order.status)"
                      @click="toast.info('این بخش را به صفحه/مودال ثبت نظر وصل کن 😊')"
                  >
                    ثبت نظر
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Details modal -->
      <dialog ref="detailsModal" class="modal">
        <div class="modal-box max-w-xl rounded-3xl">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-extrabold text-lg">
                سفارش <span class="font-mono">{{ selectedOrder?.code }}</span>
              </h3>
              <p class="text-sm opacity-70 mt-1">
                ثبت شده در {{ selectedOrder ? formatDate(selectedOrder.createdAt) : '' }}
              </p>
            </div>

            <span
                v-if="selectedOrder"
                class="badge rounded-full mt-1"
                :class="statusBadgeClass(selectedOrder.status)"
            >
              {{ statusLabel(selectedOrder.status) }}
            </span>
          </div>

          <div class="divider my-4"></div>

          <div class="space-y-3">
            <div class="rounded-2xl border border-base-300/70 bg-base-100 p-4">
              <p class="text-xs opacity-70 mb-2">اقلام سفارش</p>
              <ul class="space-y-2 text-sm">
                <li
                    v-for="(item, idx) in selectedOrder?.items || []"
                    :key="idx"
                    class="flex items-center justify-between gap-3"
                >
                  <span class="min-w-0 truncate">{{ item.productTitle }}</span>
                  <span class="badge badge-outline rounded-xl">×{{ item.quantity }}</span>
                </li>
              </ul>
            </div>

            <div class="rounded-2xl border border-base-300/70 bg-base-100 p-4 flex items-center justify-between gap-3">
              <div>
                <p class="text-xs opacity-70">کد سفارش</p>
                <p class="font-mono font-bold">{{ selectedOrder?.code }}</p>
              </div>
              <button class="btn btn-sm btn-outline rounded-2xl" @click="copy(selectedOrder?.code || '')">
                کپی کد
              </button>
            </div>
          </div>

          <div class="modal-action mt-5">
            <button class="btn rounded-2xl" @click="closeDetails">بستن</button>
          </div>
        </div>

        <form method="dialog" class="modal-backdrop">
          <button aria-label="close" @click="closeDetails">close</button>
        </form>
      </dialog>
    </div>

    <!-- Teleported Filter Menu (never clipped) -->
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
          <!-- click outside -->
          <button class="absolute inset-0 w-full h-full cursor-default" @click="closeFilter" aria-label="close" />

          <!-- menu -->
          <div
              class="absolute z-[101] w-52 rounded-2xl border border-base-300 bg-base-100 shadow-xl p-2 origin-top-right"
              :style="filterMenuStyle"
          >
            <ul class="menu p-0">
              <li><a @click="setStatusFilter('all')">همه</a></li>
              <li><a @click="setStatusFilter('pending')">در حال بررسی</a></li>
              <li><a @click="setStatusFilter('paid')">پرداخت شده</a></li>
              <li><a @click="setStatusFilter('completed')">تکمیل شده</a></li>
              <li><a @click="setStatusFilter('canceled')">کنسل شده</a></li>
            </ul>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import type { Order, OrderStatus } from '@/services/types'
import { listOrders } from '@/services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()

const orders = ref<Order[]>([])
const loading = ref(false)

const detailsModal = ref<HTMLDialogElement | null>(null)
const selectedOrder = ref<Order | null>(null)

const query = ref('')
const sort = ref<'new' | 'old'>('new')
const statusFilter = ref<'all' | 'pending' | OrderStatus>('all')

/** ---------- Filter dropdown (teleport) ---------- */
const filterOpen = ref(false)
const filterBtnRef = ref<HTMLButtonElement | null>(null)
const filterMenuStyle = ref<Record<string, string>>({})

function updateFilterMenuPosition() {
  const btn = filterBtnRef.value
  if (!btn) return
  const r = btn.getBoundingClientRect()

  // dropdown-end style (align to button right), with small offset
  const top = Math.round(r.bottom + 8)
  const right = Math.round(window.innerWidth - r.right)

  filterMenuStyle.value = {
    top: `${top}px`,
    right: `${right}px`,
  }
}

function openFilter() {
  filterOpen.value = true
}

function closeFilter() {
  filterOpen.value = false
}

function toggleFilter() {
  filterOpen.value ? closeFilter() : openFilter()
}

function setStatusFilter(v: 'all' | 'pending' | OrderStatus) {
  statusFilter.value = v
  closeFilter()
}

function onKeyDown(e: KeyboardEvent) {
  if (!filterOpen.value) return
  if (e.key === 'Escape') closeFilter()
}

function onScrollOrResize() {
  if (!filterOpen.value) return
  updateFilterMenuPosition()
}

watch(filterOpen, async (isOpen) => {
  if (!isOpen) return
  await nextTick()
  updateFilterMenuPosition()

  window.addEventListener('keydown', onKeyDown, { passive: true })
  window.addEventListener('resize', onScrollOrResize, { passive: true })
  // capture=true تا حتی اگر اسکرول روی کانتینرهای داخلی باشه هم بگیریمش
  window.addEventListener('scroll', onScrollOrResize, { passive: true, capture: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown as any)
  window.removeEventListener('resize', onScrollOrResize as any)
  window.removeEventListener('scroll', onScrollOrResize as any, true as any)
})
/** ---------- End filter dropdown ---------- */

function statusLabel(status: OrderStatus) {
  switch (status) {
    case 'completed':
      return 'تکمیل شده'
    case 'paid':
      return 'پرداخت شده'
    case 'canceled':
      return 'کنسل شده'
    default:
      return 'در حال بررسی'
  }
}

function statusBadgeClass(status: OrderStatus) {
  if (status === 'completed' || status === 'paid') return 'badge-success'
  if (status === 'canceled') return 'badge-error'
  return 'badge-warning'
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('fa-IR')
}

function truncate(s: string, n: number) {
  if (!s) return ''
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

function normalize(str: string) {
  return (str || '').toString().toLowerCase().trim()
}

function openDetails(order: Order) {
  selectedOrder.value = order
  detailsModal.value?.showModal()
}

function closeDetails() {
  detailsModal.value?.close()
  selectedOrder.value = null
}

function canReview(status: OrderStatus) {
  return status === 'paid' || status === 'completed'
}

async function copy(text: string) {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    toast.success('کپی شد')
  } catch {
    try {
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.focus()
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      toast.success('کپی شد')
    } catch {
      toast.error('کپی ناموفق بود')
    }
  }
}

function resetFilters() {
  query.value = ''
  statusFilter.value = 'all'
  sort.value = 'new'
}

const statusFilterLabel = computed(() => {
  if (statusFilter.value === 'all') return 'همه'
  if (statusFilter.value === 'pending') return 'در حال بررسی'
  return statusLabel(statusFilter.value as OrderStatus)
})

const filteredOrders = computed(() => {
  const q = normalize(query.value)

  return orders.value.filter((o) => {
    const matchStatus =
        statusFilter.value === 'all'
            ? true
            : statusFilter.value === 'pending'
                ? o.status !== 'paid' && o.status !== 'completed' && o.status !== 'canceled'
                : o.status === statusFilter.value

    if (!matchStatus) return false
    if (!q) return true

    const inCode = normalize(o.code).includes(q)
    const inItems = (o.items || []).some((it) => normalize(it.productTitle).includes(q))
    return inCode || inItems
  })
})

const sortedOrders = computed(() => {
  const arr = [...filteredOrders.value]
  arr.sort((a, b) => {
    const ta = new Date(a.createdAt).getTime()
    const tb = new Date(b.createdAt).getTime()
    return sort.value === 'new' ? tb - ta : ta - tb
  })
  return arr
})

const stats = computed(() => {
  let paid = 0
  let completed = 0
  let canceled = 0
  let pending = 0

  for (const o of orders.value) {
    if (o.status === 'paid') paid++
    else if (o.status === 'completed') completed++
    else if (o.status === 'canceled') canceled++
    else pending++
  }

  return { paid, completed, canceled, pending }
})

onMounted(async () => {
  loading.value = true
  try {
    orders.value = await listOrders()
  } catch (err: any) {
    console.error(err)
    toast.error(err?.response?.data?.message || 'خطا در دریافت سفارش‌ها')
  } finally {
    loading.value = false
  }
})
</script>
