<template>
  <div class="space-y-6" dir="rtl">
    <div class="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-xs text-warning">
      TODO: API مدیریت بنرها هنوز ارائه نشده است. تغییرات این بخش ذخیره نمی‌شود.
    </div>
    <!-- HERO بالا برای بنرها -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary/95 via-primary/85 to-secondary/80 text-primary-content p-5 sm:p-6 shadow-xl">
      <div class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1.5">
          <p class="text-[10px] uppercase tracking-[0.25em] text-primary-content/70">BANNERS</p>
          <h2 class="text-lg sm:text-2xl font-extrabold">مدیریت بنرها</h2>
          <p class="mt-1 text-xs sm:text-sm text-primary-content/80">مدیریت بنرهای اسلایدر و بخش‌های ویژه‌ی صفحه اصلی سپهر‌باکس.</p>
        </div>

        <!-- آمار و دکمه افزودن بنر -->
        <div class="flex flex-col items-end gap-2 text-[11px] sm:text-xs">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-content/80"></span>
            <span>تعداد کل بنرها:</span>
            <span class="font-bold text-sm">{{ totalBanners }}</span>
          </div>
          <div class="flex flex-wrap gap-2 justify-end">
            <button type="button" class="btn btn-sm bg-primary-content text-primary rounded-2xl border-0 hover:bg-white" @click="add">افزودن بنر</button>
          </div>
        </div>
      </div>
    </section>

    <!-- لیست بنرها + جستجو -->
    <section class="bg-base-100 rounded-3xl border border-base-300/80 p-4 sm:p-5 shadow-sm space-y-4 flex-grow" style="min-height: 450px;" >
      <!-- هدر لیست -->
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="space-y-1">
          <h3 class="text-sm sm:text-base font-semibold text-base-content">بنرها</h3>
          <p class="text-[11px] sm:text-xs text-base-content/60">لیست بنرهای فعال / قابل ویرایش</p>
        </div>

        <!-- سرچ ساده -->
        <div class="w-full sm:w-72 relative">
          <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg class="w-4 h-4 text-base-content/50" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.5"/>
              <line x1="15.5" y1="15.5" x2="20" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <input v-model="q" class="input input-bordered min-h-0 h-9 w-full pr-8 rounded-2xl text-[11px] py-1" placeholder="جستجو در عنوان یا لینک بنر..."/>
        </div>
      </div>

      <!-- بدنه لیست -->
      <div class="space-y-3">
        <!-- اگر بنری هست -->
        <div v-if="paginatedBanners.length" class="grid gap-3 sm:gap-4 md:grid-cols-2">
          <article v-for="b in paginatedBanners" :key="b.id" class="group rounded-2xl border border-base-300 bg-base-100/90 px-3.5 py-3 sm:px-4 sm:py-3.5 flex items-center justify-between gap-3 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 transition-all">
            <!-- اطلاعات بنر -->
            <div class="flex items-center gap-3">
              <!-- تصویر بنر -->
              <div class="h-14 w-24 sm:h-16 sm:w-28 rounded-xl overflow-hidden bg-base-200 flex items-center justify-center">
                <img v-if="b.image" :src="b.image" :alt="b.alt || 'بنر'" class="w-full h-full object-cover"/>
                <span v-else class="text-[10px] text-base-content/50">بدون تصویر</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs sm:text-sm font-medium text-base-content truncate max-w-[180px]">{{ b.alt || 'بدون عنوان' }}</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-base-200/70 text-[10px] text-base-content/70">ID: {{ b.id }}</span>
              </div>
            </div>

            <!-- اکشن‌ها -->
            <div class="flex flex-col items-end gap-1 text-[10px] sm:text-[11px] min-w-[110px]">
              <button class="btn btn-xs btn-outline w-full justify-center" @click="edit(b.id)">ویرایش</button>
              <button class="btn btn-xs btn-error w-full justify-center" @click="remove(b.id)">حذف</button>
            </div>
          </article>
        </div>

        <!-- اگر هیچ بنری نبود -->
        <div v-else class="py-10 flex flex-col items-center justify-center gap-2 text-center text-xs text-base-content/60">
          <div class="h-16 w-16 rounded-3xl border border-dashed border-base-300 flex items-center justify-center mb-1">
            <div class="h-8 w-8 rounded-2xl bg-base-200"></div>
          </div>
          <p>بنری با این شرایط پیدا نشد.</p>
          <p class="text-[11px] text-base-content/50">عبارت جستجو را تغییر بده یا بنر جدیدی اضافه کن.</p>
        </div>
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
import { useRouter } from 'vue-router'

const router = useRouter()

interface Banner {
  id: string
  image: string
  alt: string
  to: string
}

const banners = ref<Banner[]>([])

const q = ref('')

type FilterKey = 'all' | string

const filterOptions: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'همه بنرها' },
  // You can add more filters here if needed
]

const currentPage = ref(1)
const bannersPerPage = 5

// Filter banners based on search input
const filteredBanners = computed(() => {
  if (!q.value) return banners.value
  const t = q.value.toLowerCase()
  return banners.value.filter(
      (b) => b.alt?.toLowerCase().includes(t) || b.to?.toLowerCase().includes(t) || b.id.toLowerCase().includes(t)
  )
})

const totalBanners = computed(() => banners.value.length)

// Paginate the filtered banners
const totalPages = computed(() => Math.ceil(filteredBanners.value.length / bannersPerPage))

const paginatedBanners = computed(() => {
  const start = (currentPage.value - 1) * bannersPerPage
  const end = start + bannersPerPage
  return filteredBanners.value.slice(start, end)
})

function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

function add() {
  router.push({ name: 'admin-banner-create' })
}

function edit(id: string) {
  router.push({ name: 'admin-banner-edit', params: { id } })
}

function remove() {
  // TODO: API حذف بنر
}
</script>
