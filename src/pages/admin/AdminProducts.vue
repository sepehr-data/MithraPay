<template>
  <div class="space-y-6" dir="rtl">
    <!-- HERO بالا برای محصولات -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary/95 via-primary/85 to-secondary/80 text-primary-content p-5 sm:p-6 shadow-xl">
      <div class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <!-- عنوان و توضیح -->
        <div class="space-y-1.5">
          <p class="text-[10px] uppercase tracking-[0.25em] text-primary-content/70">PRODUCTS</p>
          <h2 class="text-lg sm:text-2xl font-extrabold">مدیریت محصولات</h2>
          <p class="mt-1 text-xs sm:text-sm text-primary-content/80">مشاهده، جستجو و مدیریت محصولات فعال فروشگاه سپهر‌باکس.</p>
        </div>

        <!-- آمار و دکمه افزودن محصول -->
        <div class="flex flex-col items-end gap-2 text-[11px] sm:text-xs">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-content/80"></span>
            <span>تعداد کل محصولات:</span>
            <span class="font-bold text-sm">{{ totalProducts }}</span>
          </div>

          <div class="flex flex-wrap gap-2 justify-end">
            <div v-if="categories.length" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20">
              <span class="w-1.5 h-1.5 rounded-full bg-primary-content/80"></span>
              <span>تعداد دسته‌ها:</span>
              <span class="font-bold text-sm">{{ categories.length }}</span>
            </div>

            <RouterLink to="/admin/products/new" class="btn btn-sm bg-primary-content text-primary rounded-2xl border-0 hover:bg-white">
              افزودن محصول
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- لیست کارت‌محور محصولات + جستجو -->
    <section class="bg-base-100 rounded-3xl border border-base-300 p-4 sm:p-5 shadow-sm space-y-4 flex-grow" style="min-height: 420px;">
      <!-- هدر + اینپوت جستجو -->
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-col gap-1">
          <h3 class="font-semibold text-sm sm:text-base">محصولات</h3>
          <span class="text-[11px] sm:text-xs text-base-content/60">{{ filteredCount }} محصول در این لیست</span>
        </div>

        <!-- سرچ داخل همین بخش -->
        <div class="w-full sm:w-72 relative">
          <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg class="w-4 h-4 text-base-content/50" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.5"/>
              <line x1="15.5" y1="15.5" x2="20" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <input v-model="q" type="text" class="input input-bordered min-h-0 h-9 w-full pr-8 rounded-2xl text-[11px] py-1" placeholder="جستجو در عنوان یا دسته..."/>
        </div>
      </div>

      <!-- تب‌های فیلتر دسته‌ها (زیر هدر) -->
      <div v-if="categories.length" class="flex flex-wrap gap-2 text-[11px] sm:text-xs">
        <button type="button" class="px-3 py-1 rounded-full border transition-colors" :class="categoryFilter === 'all' ? 'bg-primary text-primary-content border-primary/70' : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'" @click="categoryFilter = 'all'">همه دسته‌ها</button>
        <button v-for="cat in categories" :key="cat" type="button" class="px-3 py-1 rounded-full border transition-colors" :class="categoryFilter === cat ? 'bg-primary text-primary-content border-primary/70' : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'" @click="categoryFilter = cat">{{ cat }}</button>
      </div>

      <!-- اگر محصولی هست -->
      <div v-if="filtered.length" class="grid gap-3 sm:gap-4 md:grid-cols-2">
        <article v-for="p in paginatedProducts" :key="p.id" class="group rounded-2xl border border-base-300 bg-base-100/90 px-3.5 py-3 sm:px-4 sm:py-3.5 flex items-center justify-between gap-3 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 transition-all">
          <!-- اطلاعات محصول -->
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-gradient-to-br from-primary/90 to-secondary/80 text-primary-content flex items-center justify-center text-[11px] sm:text-xs font-bold shadow-sm">
              {{ avatarInitial(p) }}
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs sm:text-sm font-medium text-base-content truncate max-w-[200px]">{{ p.title }}</span>
              <div class="flex flex-wrap gap-1.5 items-center">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-base-200/80 text-[10px] sm:text-[11px] text-base-content/80 whitespace-nowrap">{{ formatPrice(p.price) }}</span>
                <span v-if="p.categoryId" class="inline-flex items-center px-2 py-0.5 rounded-full bg-base-200/60 text-[10px] sm:text-[11px] text-base-content/70">دسته: {{ p.categoryId }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1 text-[10px] sm:text-[11px] min-w-[110px]">
            <RouterLink :to="`/admin/products/${p.id}`" class="btn btn-xs btn-outline w-full justify-center">ویرایش</RouterLink>
            <button class="btn btn-xs btn-error w-full justify-center" @click="remove(p.id)">حذف</button>
          </div>
        </article>
      </div>

      <!-- اگر هیچ محصولی نبود -->
      <div v-else class="py-10 flex flex-col items-center justify-center gap-2 text-center text-xs text-base-content/60">
        <div class="h-16 w-16 rounded-3xl border border-dashed border-base-300 flex items-center justify-center mb-1">
          <div class="h-8 w-8 rounded-2xl bg-base-200"></div>
        </div>
        <p>محصولی با این شرایط پیدا نشد.</p>
        <p class="text-[11px] text-base-content/50">عبارت جستجو یا فیلتر دسته را تغییر بده تا محصولات بیشتری نمایش داده شوند.</p>
      </div>
    </section>

    <!-- پیجینیشن پایین‌ترین بخش div -->
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

const products = ref([
  { id: 'p1', title: 'محصول 1', price: 1000, categoryId: 'cat1' },
  { id: 'p2', title: 'محصول 2', price: 2000, categoryId: 'cat2' },
  // اضافه کردن محصولات به همین شکل
])

const q = ref('')
const categoryFilter = ref<'all' | string>('all')
const currentPage = ref(1)
const productsPerPage = 5

// فیلتر دسته‌ها
const categories = computed(() => {
  const set = new Set<string>()
  for (const p of products.value) {
    if (p.categoryId) {
      set.add(p.categoryId)
    }
  }
  return Array.from(set)
})

// فیلتر محصولات بر اساس جستجو و دسته
const filtered = computed(() => {
  let base = [...products.value]

  if (categoryFilter.value !== 'all') {
    base = base.filter(p => p.categoryId === categoryFilter.value)
  }

  if (!q.value) return base

  const t = q.value.toLowerCase()
  return base.filter(p => p.title.toLowerCase().includes(t))
})

// تعداد کل محصولات فیلتر شده
const totalProducts = computed(() => filtered.value.length)

const filteredCount = computed(() => filtered.value.length)
const totalPages = computed(() => Math.ceil(filtered.value.length / productsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * productsPerPage
  const end = start + productsPerPage
  return filtered.value.slice(start, end)
})

function formatPrice(val: number) {
  return new Intl.NumberFormat('fa-IR').format(val) + ' تومان'
}

function avatarInitial(p: { title?: string; id: string }) {
  if (p.title && p.title.trim().length > 0) {
    return p.title.trim().charAt(0)
  }
  return p.id.trim().charAt(0)
}

function remove(id: string) {
  const idx = products.value.findIndex(p => p.id === id)
  if (idx >= 0) products.value.splice(idx, 1)
}

function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}
</script>
