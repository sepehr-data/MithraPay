<template>
  <div class="space-y-6" dir="rtl">
    <!-- HERO بالا برای بنرها -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary/95 via-primary/85 to-secondary/80 text-primary-content p-5 sm:p-6 shadow-xl">
      <div class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1.5">
          <p class="text-[10px] uppercase tracking-[0.25em] text-primary-content/70">BANNERS</p>
          <h2 class="text-lg sm:text-2xl font-extrabold">مدیریت بنرها</h2>
          <p class="mt-1 text-xs sm:text-sm text-primary-content/80">مدیریت بنرهای اسلایدر و بخش‌های ویژه‌ی صفحه اصلی رد اسکای.</p>
        </div>

        <!-- آمار و دکمه افزودن بنر -->
        <div class="flex flex-col items-end gap-2 text-[11px] sm:text-xs">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-content/80"></span>
            <span>تعداد کل بنرها:</span>
            <span class="font-bold text-sm">{{ totalBanners }}</span>
          </div>
          <div class="flex flex-wrap gap-2 justify-end">
            <!-- ✅ بدون تغییر ظاهر دکمه -->
            <button
                type="button"
                class="btn btn-sm bg-primary-content text-primary rounded-2xl border-0 hover:bg-white"
                @click="openCreateModal"
            >
              افزودن بنر
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- فیلتر و جستجوی بنرها -->
    <section class="rounded-3xl bg-base-100 border border-base-300/80 p-4 sm:p-5 shadow-sm space-y-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="space-y-1">
          <h3 class="text-sm sm:text-base font-semibold text-base-content">
            جستجو و فیلتر بنرها
          </h3>
        </div>

        <!-- input جستجو -->
        <div class="w-full sm:w-72 relative mt-1 sm:mt-0">
          <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg class="w-4 h-4 text-base-content/50" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.5"/>
              <line x1="15.5" y1="15.5" x2="20" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <input
              v-model="q"
              type="text"
              class="input input-bordered min-h-0 h-9 w-full pr-8 rounded-2xl text-[11px] py-1"
              placeholder="جستجو در عنوان یا لینک بنر..."
          />
        </div>
      </div>

      <!-- تب‌های وضعیت بنرها زیر input -->
      <div class="flex gap-2 text-[11px] sm:text-xs">
        <button
            v-for="opt in bannerFilterOptions"
            :key="opt.key"
            type="button"
            class="px-3 py-1 rounded-full border transition-colors whitespace-nowrap"
            :class="bannerStatusFilter === opt.key
            ? 'bg-primary text-primary-content border-primary/70'
            : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'"
            @click="bannerStatusFilter = opt.key as 'all' | 'active' | 'deactive'"
        >
          {{ opt.label }}
        </button>
      </div>
    </section>

    <!-- لیست بنرها + جستجو -->
    <section
        class="bg-base-100 rounded-3xl border border-base-300/80 p-4 sm:p-5 shadow-sm space-y-4 flex-grow"
        style="min-height: 450px;"
    >
      <div class="flex items-center justify-between mb-1">
        <h3 class="font-semibold text-sm sm:text-base">بنرها</h3>
        <span class="text-[11px] text-base-content/60">
          {{ filteredBanners.length }} بنر در این لیست
        </span>
      </div>

      <!-- بدنه لیست -->
      <div class="space-y-3">
        <!-- اگر بنری هست -->
        <div v-if="paginatedBanners.length" class="grid gap-3 sm:gap-4 md:grid-cols-2">
          <article
              v-for="b in paginatedBanners"
              :key="b.id"
              class="group rounded-2xl border border-base-300 bg-base-100/90 px-3.5 py-3 sm:px-4 sm:py-3.5 flex items-center justify-between gap-3 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 transition-all"
          >
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

                <!-- ✅ (اختیاری و کوچک) نمایش وضعیت بدون تغییر طراحی: فقط یک badge خیلی کوچیک -->
                <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px]"
                    :class="b.status === 'active'
                    ? 'bg-success/15 text-success'
                    : 'bg-base-200/70 text-base-content/60'"
                >
                  {{ b.status === 'active' ? 'فعال' : 'غیرفعال' }}
                </span>
              </div>
            </div>

            <!-- اکشن‌ها -->
            <div class="flex flex-col items-end gap-1 text-[10px] sm:text-[11px] min-w-[110px]">
              <!-- ✅ به جای route، مودال ویرایش باز می‌شود -->
              <button class="btn btn-xs btn-outline w-full justify-center" @click="openEditModal(b.id)">
                ویرایش
              </button>
              <button class="btn btn-xs btn-error w-full justify-center" @click="confirmRemove(b.id, b.alt)">
                حذف
              </button>
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
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === 1" @click="changePage(1)">&lt;&lt;</button>
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">&lt;</button>
        <button class="btn btn-sm btn-ghost">{{ currentPage }} / {{ totalPages }}</button>
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">&gt;</button>
        <button class="btn btn-sm btn-ghost" :disabled="currentPage === totalPages" @click="changePage(totalPages)">&gt;&gt;</button>
      </div>
    </section>

    <!-- MODAL حذف -->
    <div v-if="deleteModal.open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-base-100 rounded-xl shadow-lg p-5 w-72 sm:w-80 flex flex-col gap-4">
        <h3 class="text-base font-semibold text-error">حذف بنر</h3>
        <p class="text-sm text-base-content/70">
          آیا از حذف <span class="font-medium">{{ deleteModal.title || 'این بنر' }}</span> مطمئن هستید؟
        </p>
        <div class="flex justify-end gap-3 mt-2">
          <button class="btn btn-ghost btn-sm" @click="deleteModal.open = false">لغو</button>
          <button class="btn btn-error btn-sm" @click="remove(deleteModal.id)">حذف</button>
        </div>
      </div>
    </div>

    <!-- ✅ MODAL ایجاد/ویرایش (این همون تغییریه که خواستی) -->
    <div v-if="upsertModal.open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-base-100 rounded-xl shadow-lg p-5 w-[92%] max-w-xl flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">
            {{ upsertModal.mode === 'create' ? 'افزودن بنر' : 'ویرایش بنر' }}
          </h3>
          <button class="btn btn-ghost btn-sm" @click="closeUpsert">✕</button>
        </div>

        <div class="grid gap-3">
          <div class="space-y-1">
            <label class="text-[11px] text-base-content/70">عنوان</label>
            <input
                v-model="form.title"
                type="text"
                class="input input-bordered min-h-0 h-10 w-full rounded-2xl text-[11px] py-1"
                placeholder="عنوان بنر"
            />
          </div>

          <div class="space-y-1">
            <label class="text-[11px] text-base-content/70">لینک (اختیاری)</label>
            <input
                v-model="form.link"
                type="text"
                class="input input-bordered min-h-0 h-10 w-full rounded-2xl text-[11px] py-1"
                placeholder="مثلاً /products یا https://..."
            />
          </div>

          <div class="space-y-1">
            <label class="text-[11px] text-base-content/70">آدرس تصویر</label>
            <input
                v-model="form.image_url"
                type="text"
                class="input input-bordered min-h-0 h-10 w-full rounded-2xl text-[11px] py-1"
                placeholder="https://... یا /uploads/..."
            />

            <!-- ✅ دقیقا زیر input آدرس تصویر: گزینه بنر فعال است -->
            <div class="mt-2 flex items-center justify-between gap-3">
              <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                <input v-model="form.isActive" type="checkbox" class="checkbox checkbox-sm" />
                <span class="text-[11px] text-base-content/80">بنر فعال است</span>
              </label>

            </div>
          </div>

          <!-- پیش نمایش خیلی سبک -->
          <div class="rounded-2xl border border-base-300 bg-base-100/80 p-3">
            <div class="text-[11px] text-base-content/60 mb-2">پیش‌نمایش</div>
            <div class="h-28 w-full rounded-2xl overflow-hidden bg-base-200 flex items-center justify-center">
              <img
                  v-if="previewImage"
                  :src="previewImage"
                  alt="banner"
                  class="w-full h-full object-cover"
              />
              <span v-else class="text-[10px] text-base-content/50">بدون تصویر</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-1">
          <button class="btn btn-ghost btn-sm" :disabled="upsertModal.loading" @click="closeUpsert">
            لغو
          </button>
          <button class="btn btn-primary btn-sm" :class="upsertModal.loading ? 'btn-disabled' : ''" @click="submitUpsert">
            {{ upsertModal.loading ? 'در حال ذخیره...' : 'ذخیره' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import {
  adminListBanners,
  adminDeleteBanner,
  adminCreateBanner,
  adminUpdateBanner,
  adminGetBanner,
} from '@/services/admin.ts'
import type {
  AdminListBannersResponse,
  AdminCreateBannerPayload,
  AdminUpdateBannerPayload,
  AdminGetBannerResponse,
} from '@/types/api_client_types/admin.dto.ts'

const toast = useToast()

/** ✅ وضعیت UI */
type BannerStatusUI = 'active' | 'deactive'

interface Banner {
  id: number
  image: string
  alt: string
  to: string
  status: BannerStatusUI
}

const banners = ref<Banner[]>([])
const q = ref('')
const currentPage = ref(1)
const bannersPerPage = 6

/* ------------------ فیلتر وضعیت ------------------ */
const bannerStatusFilter = ref<'all' | BannerStatusUI>('all')

const bannerFilterOptions = [
  { key: 'all', label: 'همه بنرها' },
  { key: 'active', label: 'فعال' },
  { key: 'deactive', label: 'غیر فعال' }
] as const

/* ------------------ مودال حذف ------------------ */
const deleteModal = ref<{ open: boolean; id: number; title: string }>({
  open: false,
  id: 0,
  title: ''
})

/* ------------------ ✅ مودال ایجاد/ویرایش ------------------ */
const upsertModal = ref<{
  open: boolean
  mode: 'create' | 'edit'
  id: number | null
  loading: boolean
}>({
  open: false,
  mode: 'create',
  id: null,
  loading: false
})

/** ✅ فرم ایجاد/ویرایش */
const form = ref<{
  title: string
  link: string
  image_url: string
  isActive: boolean
}>({
  title: '',
  link: '',
  image_url: '',
  isActive: true
})

const previewImage = computed(() => {
  const u = String(form.value.image_url || '').trim()
  if (!u) return ''
  if (u.startsWith('http') || u.startsWith('/')) return u
  return ''
})

/* ------------------ computed ------------------ */
const totalBanners = computed(() => banners.value.length)

const filteredBanners = computed(() => {
  const text = q.value.trim().toLowerCase()

  return banners.value.filter(b => {
    const matchText =
        !text ||
        b.alt?.toLowerCase().includes(text) ||
        b.to?.toLowerCase().includes(text) ||
        b.id.toString().includes(text)

    const matchStatus =
        bannerStatusFilter.value === 'all' ||
        b.status === bannerStatusFilter.value

    return matchText && matchStatus
  })
})

const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredBanners.value.length / bannersPerPage))
)

const paginatedBanners = computed(() => {
  const start = (currentPage.value - 1) * bannersPerPage
  return filteredBanners.value.slice(start, start + bannersPerPage)
})

/* وقتی سرچ یا فیلتر عوض شد برگرد صفحه ۱ */
watch([q, bannerStatusFilter], () => {
  currentPage.value = 1
})

/* ------------------ actions ------------------ */
function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

/** ✅ ایجاد بنر داخل مودال */
function openCreateModal() {
  form.value = { title: '', link: '', image_url: '', isActive: true }
  upsertModal.value = { open: true, mode: 'create', id: null, loading: false }
}

async function openEditModal(id: number) {
  upsertModal.value = { open: true, mode: 'edit', id, loading: true }
  try {
    const data: AdminGetBannerResponse = await adminGetBanner(id)

    form.value.title = data.title ?? ''
    form.value.link = data.link ?? ''
    form.value.image_url = data.image_url ?? ''

    const raw = String(data.status ?? '').trim().toUpperCase()
    form.value.isActive = raw === 'ACTIVE'
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'خطا در دریافت اطلاعات بنر')
    closeUpsert()
  } finally {
    upsertModal.value.loading = false
  }
}

function closeUpsert() {
  upsertModal.value.open = false
  upsertModal.value.loading = false
  upsertModal.value.id = null
}

/** ✅ اینجا payload ساخته می‌شود و status اضافه می‌شود */
function buildPayload(): AdminCreateBannerPayload {
  return {
    title: String(form.value.title || '').trim(),
    link: String(form.value.link || '').trim() || undefined,
    image_url: String(form.value.image_url || '').trim(),
    status: form.value.isActive ? 'ACTIVE' : 'DEACTIVE',
  }
}

async function submitUpsert() {
  const title = String(form.value.title || '').trim()
  const imageUrl = String(form.value.image_url || '').trim()
  if (!title) return toast.error('عنوان بنر الزامی است')
  if (!imageUrl) return toast.error('آدرس تصویر بنر الزامی است')

  upsertModal.value.loading = true
  try {
    const payload = buildPayload()

    if (upsertModal.value.mode === 'create') {
      await adminCreateBanner(payload)
      toast.success('بنر با موفقیت ایجاد شد')
    } else {
      const id = upsertModal.value.id!
      const updatePayload: AdminUpdateBannerPayload = payload
      await adminUpdateBanner(id, updatePayload)
      toast.success('بنر با موفقیت بروزرسانی شد')
    }

    closeUpsert()
    await fetchBanners()
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'خطا در ذخیره بنر')
  } finally {
    upsertModal.value.loading = false
  }
}

/* ------------------ حذف ------------------ */
function confirmRemove(id: number, title?: string) {
  deleteModal.value = { open: true, id, title: title || '' }
}

async function remove(id: number) {
  try {
    await adminDeleteBanner(id)
    banners.value = banners.value.filter(b => b.id !== id)
    deleteModal.value.open = false
    toast.success('بنر با موفقیت حذف شد')
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'خطا در حذف بنر')
  }
}

/* ------------------ fetch ------------------ */
async function fetchBanners() {
  try {
    const data: AdminListBannersResponse = await adminListBanners()

    banners.value = data.map((b: any) => {
      // ✅ وضعیت‌ها مطابق بک‌اند: ACTIVE/DEACTIVE
      const rawStatus = String(b.status ?? '').trim().toLowerCase()
      const status: BannerStatusUI = rawStatus === 'active' ? 'active' : 'deactive'

      // عکس
      const img = String(b.image_url ?? '').trim()
      const fallbackImg = String(b.link ?? '').trim()

      const image =
          img.startsWith('http') || img.startsWith('/')
              ? img
              : (fallbackImg.startsWith('http') || fallbackImg.startsWith('/'))
                  ? fallbackImg
                  : ''

      return {
        id: b.id,
        image,
        alt: b.title ?? '',
        to: b.link || '',
        status
      }
    })
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'خطا در دریافت بنرها')
  }
}

onMounted(fetchBanners)
</script>
