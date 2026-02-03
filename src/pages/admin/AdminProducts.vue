<template>
  <div class="space-y-6" dir="rtl">
    <!-- HERO بالا -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary/95 via-primary/85 to-secondary/80 text-primary-content p-5 sm:p-6 shadow-xl">
      <div class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1.5">
          <p class="text-[10px] uppercase tracking-[0.25em] text-primary-content/70">PRODUCTS</p>
          <h2 class="text-lg sm:text-2xl font-extrabold">مدیریت محصولات</h2>
          <p class="mt-1 text-xs sm:text-sm text-primary-content/80">مشاهده، جستجو و مدیریت محصولات فعال فروشگاه سپهر‌باکس.</p>
        </div>

        <div class="flex flex-col items-end gap-2 text-[11px] sm:text-xs">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-content/80"></span>
            <span>تعداد کل محصولات:</span>
            <span class="font-bold text-sm">{{ totalProducts }}</span>
          </div>

          <div class="flex flex-wrap gap-2 justify-end">
            <div v-if="categoryNames.length" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20">
              <span class="w-1.5 h-1.5 rounded-full bg-primary-content/80"></span>
              <span>تعداد دسته‌ها:</span>
              <span class="font-bold text-sm">{{ categoryNames.length }}</span>
            </div>

            <RouterLink to="/admin/products/new" class="btn btn-sm bg-primary-content text-primary rounded-2xl border-0 hover:bg-white">
              افزودن محصول
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- فیلتر محصولات -->
    <section class="rounded-3xl bg-base-100 border border-base-300/80 p-4 sm:p-5 shadow-sm space-y-4">
      <!-- عنوان و input جستجو -->
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="space-y-1">
          <h3 class="text-sm sm:text-base font-semibold text-base-content">جستجو و فیلتر محصولات</h3>
        </div>

        <div class="w-full sm:w-72 relative mt-1 sm:mt-0">
          <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg class="w-4 h-4 text-base-content/50" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.5" />
              <line x1="15.5" y1="15.5" x2="20" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </span>

          <input
              v-model="q"
              type="text"
              placeholder="جستجو در عنوان..."
              class="input input-bordered min-h-0 h-9 w-full pr-8 rounded-2xl text-[11px] py-1 text-right"
          />
        </div>
      </div>

      <!-- ✅ سطر ۱: تب‌ها + عنوان (جاشون عوض شد) -->
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <!-- تب‌ها اول -->
        <div class="flex flex-wrap gap-2 text-[11px] sm:text-xs sm:justify-start">
          <button
              type="button"
              class="px-3 py-1 rounded-full border transition-colors whitespace-nowrap"
              :class="statusFilter === 'all'
              ? 'bg-primary text-primary-content border-primary/70'
              : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'"
              @click="statusFilter = 'all'"
          >
            همه
          </button>

          <button
              type="button"
              class="px-3 py-1 rounded-full border transition-colors whitespace-nowrap"
              :class="statusFilter === 'active'
              ? 'bg-primary text-primary-content border-primary/70'
              : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'"
              @click="statusFilter = 'active'"
          >
            فعال
          </button>

          <button
              type="button"
              class="px-3 py-1 rounded-full border transition-colors whitespace-nowrap"
              :class="statusFilter === 'inactive'
              ? 'bg-primary text-primary-content border-primary/70'
              : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'"
              @click="statusFilter = 'inactive'"
          >
            غیرفعال
          </button>
        </div>

        <!-- عنوان بعد -->
        <div class="flex items-center gap-2 sm:justify-end">
          <span class="text-[11px] sm:text-xs font-semibold text-base-content/80">وضعیت محصول</span>
          <span class="text-[10px] sm:text-[11px] text-base-content/50 hidden sm:inline">
            •
          </span>
        </div>
      </div>

      <!-- ✅ سطر ۲: تب‌ها + عنوان (جاشون عوض شد) -->
      <div v-if="categoryNames.length" class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <!-- تب‌ها اول -->
        <div class="flex flex-wrap gap-2 text-[11px] sm:text-xs sm:justify-start">
          <button
              type="button"
              class="px-3 py-1 rounded-full border transition-colors whitespace-nowrap"
              :class="categoryFilter === 'all'
              ? 'bg-primary text-primary-content border-primary/70'
              : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'"
              @click="categoryFilter = 'all'"
          >
            همه دسته‌ها
          </button>

          <button
              v-for="cat in categoryNames"
              :key="cat"
              type="button"
              class="px-3 py-1 rounded-full border transition-colors whitespace-nowrap"
              :class="categoryFilter === cat
              ? 'bg-primary text-primary-content border-primary/70'
              : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'"
              @click="categoryFilter = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- عنوان بعد -->
        <div class="flex items-center gap-2 sm:justify-end">
          <span class="text-[11px] sm:text-xs font-semibold text-base-content/80">دسته‌بندی</span>
          <span class="text-[10px] sm:text-[11px] text-base-content/50 hidden sm:inline">
            •
          </span>
        </div>
      </div>
    </section>

    <!-- لیست محصولات -->
    <section
        class="rounded-3xl border border-base-300 bg-base-100 p-4 sm:p-5 shadow-sm flex-grow"
        style="min-height: 420px;"
    >
      <!-- هدر لیست -->
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-sm sm:text-base">محصولات</h3>
        <span class="text-[11px] text-base-content/60">{{ filtered.length }} محصول در این لیست</span>
      </div>

      <!-- کارت محصولات -->
      <div v-if="filtered.length" class="grid gap-3 sm:gap-4 md:grid-cols-2">
        <article
            v-for="p in paginatedProducts"
            :key="p.id"
            class="group rounded-2xl border border-base-300 bg-base-100/90 px-3 py-3 flex items-center justify-between gap-3 hover:shadow-md transition-all"
        >
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-gradient-to-br from-primary/80 to-secondary/60 text-primary-content flex items-center justify-center text-[11px] font-bold">
              {{ avatarInitial(p) }}
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-xs sm:text-sm font-medium text-base-content truncate max-w-[200px]">
                {{ p.title }}
              </span>

              <span class="text-[10px] text-base-content/70">
                {{ formatPrice(p.price) }}
              </span>

              <span v-if="p.category_id != null" class="text-[10px] text-base-content/70">
                دسته: {{ getCategoryName(p.category_id) }}
              </span>

              <div class="pt-1">
                <span
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border"
                    :class="p.is_active
                    ? 'bg-success/10 text-success border-success/25'
                    : 'bg-error/10 text-error border-error/25'"
                >
                  <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="p.is_active ? 'bg-success' : 'bg-error'"
                  ></span>
                  {{ p.is_active ? 'فعال' : 'غیرفعال' }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1 min-w-[100px]">
            <RouterLink :to="`/admin/products/${p.id}`" class="btn btn-xs btn-outline w-full justify-center">ویرایش</RouterLink>
            <button class="btn btn-xs btn-error w-full justify-center" @click="confirmRemove(p.id, p.title)">حذف</button>
          </div>
        </article>
      </div>

      <!-- پیام خالی -->
      <div v-else class="py-10 flex flex-col items-center justify-center gap-2 text-center text-xs text-base-content/60">
        <div class="h-16 w-16 rounded-3xl border border-dashed border-base-300 flex items-center justify-center mb-1">
          <div class="h-8 w-8 rounded-2xl bg-base-200"></div>
        </div>
        <p>محصولی با این شرایط پیدا نشد.</p>
        <p class="text-[11px] text-base-content/50">عبارت جستجو یا فیلترها را تغییر بده تا محصولات بیشتری نمایش داده شوند.</p>
      </div>
    </section>

    <!-- Pagination -->
    <section class="flex justify-center py-4 mt-auto">
      <div class="btn-group">
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === 1" @click="changePage(1)">&lt;&lt;</button>
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">&lt;</button>
        <button class="btn btn-sm btn-ghost">{{ currentPage }} / {{ totalPages }}</button>
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">&gt;</button>
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === totalPages" @click="changePage(totalPages)">&gt;&gt;</button>
      </div>
    </section>

    <!-- MODAL حذف مینیمال -->
    <div v-if="deleteModal.open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-base-100 rounded-xl shadow-lg p-5 w-72 sm:w-80 flex flex-col gap-4">
        <h3 class="text-base font-semibold text-error">حذف محصول</h3>
        <p class="text-sm text-base-content/70">
          آیا از حذف <span class="font-medium">{{ deleteModal.title }}</span> مطمئن هستید؟
        </p>
        <div class="flex justify-end gap-3 mt-2">
          <button class="btn btn-ghost btn-sm" @click="deleteModal.open = false">لغو</button>
          <button class="btn btn-error btn-sm" @click="remove(deleteModal.id)">حذف</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { adminListProducts, adminDeleteProduct } from '@/services/admin.ts'
import type { AdminProductListItem } from '@/types/api_client_types/admin.dto.ts'

const toast = useToast()

const products = ref<AdminProductListItem[]>([])
const totalProducts = ref(0)

const q = ref('')
const categoryFilter = ref<'all' | string>('all')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')

const currentPage = ref(1)
const productsPerPage = 6

const deleteModal = ref<{ open: boolean; id: number; title: string }>({ open: false, id: 0, title: '' })

const CATEGORY_NAMES: Record<number, string> = {
  1: 'اکانت',
  2: 'گیفت کارت',
  3: 'خدمات',
}

const categoryMap = ref<Record<number, string>>({})
const categoryNames = ref<string[]>([])

function getCategoryName(id: number) {
  return CATEGORY_NAMES[id] ?? `دسته ${id}`
}

const statusFilterLabel = computed(() => {
  if (statusFilter.value === 'active') return 'فقط محصولات فعال'
  if (statusFilter.value === 'inactive') return 'فقط محصولات غیرفعال'
  return 'همه محصولات'
})

const filtered = computed(() => {
  let base = [...products.value]

  if (statusFilter.value === 'active') base = base.filter((p) => !!p.is_active)
  else if (statusFilter.value === 'inactive') base = base.filter((p) => !p.is_active)

  if (categoryFilter.value !== 'all') {
    base = base.filter((p) => p.category_id != null && getCategoryName(p.category_id) === categoryFilter.value)
  }

  if (q.value) {
    const term = q.value.toLowerCase()
    base = base.filter((p) => (p.title ?? '').toLowerCase().includes(term))
  }

  return base
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * productsPerPage
  return filtered.value.slice(start, start + productsPerPage)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / productsPerPage)))

function formatPrice(val: number) {
  return new Intl.NumberFormat('fa-IR').format(val) + ' تومان'
}

function avatarInitial(p: { title?: string; id: number }) {
  return p.title?.trim()?.charAt(0) ?? p.id.toString().charAt(0)
}

function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

watch([q, categoryFilter, statusFilter], () => {
  currentPage.value = 1
})

async function fetchProducts() {
  try {
    const data = await adminListProducts({ limit: 100, offset: 0 })
    const items = Array.isArray(data) ? data : data.items ?? []
    products.value = items
    totalProducts.value = Array.isArray(data) ? data.length : data.pagination?.total ?? items.length

    const map: Record<number, string> = {}
    const set = new Set<string>()
    items.forEach((p) => {
      if (p.category_id != null) {
        const name = getCategoryName(p.category_id)
        map[p.category_id] = name
        set.add(name)
      }
    })
    categoryMap.value = map
    categoryNames.value = Array.from(set)
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'خطا در دریافت محصولات')
  }
}

function confirmRemove(id: number, title: string) {
  deleteModal.value = { open: true, id, title }
}

async function remove(id: number) {
  try {
    await adminDeleteProduct(id)
    const idx = products.value.findIndex((p) => p.id === id)
    if (idx >= 0) products.value.splice(idx, 1)
    deleteModal.value.open = false
    toast.success('محصول با موفقیت حذف شد')
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'خطا در حذف محصول')
  }
}

onMounted(fetchProducts)
</script>
