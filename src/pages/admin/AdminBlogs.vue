<template>
  <div class="space-y-6" dir="rtl">
    <!-- HERO -->
    <section
        class="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary/95 via-primary/85 to-secondary/80 text-primary-content p-5 sm:p-6 shadow-xl"
    >
      <div class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1.5">
          <p class="text-[10px] uppercase tracking-[0.25em] text-primary-content/70">ARTICLES</p>
          <h2 class="text-lg sm:text-2xl font-extrabold">مدیریت مقالات</h2>
          <p class="mt-1 text-xs sm:text-sm text-primary-content/80">
            مدیریت و ویرایش مقالات آموزشی و محتوای وبلاگ سپهر‌باکس.
          </p>
        </div>

        <div class="flex flex-col items-end gap-2 text-[11px] sm:text-xs">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-content/80"></span>
            <span>تعداد کل مقالات:</span>
            <span class="font-bold text-sm">{{ totalBlogs }}</span>
          </div>

          <div class="flex flex-wrap gap-2 justify-end">
            <RouterLink
                to="/admin/blogs/new"
                class="btn btn-sm bg-primary-content text-primary rounded-2xl border-0 hover:bg-white"
            >
              مطلب جدید
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- FILTER -->
    <section class="rounded-3xl bg-base-100 border border-base-300/80 p-4 sm:p-5 shadow-sm space-y-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="space-y-1">
          <h3 class="text-sm sm:text-base font-semibold text-base-content">جستجو و فیلتر مقالات</h3>
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
              class="input input-bordered min-h-0 h-9 w-full pr-8 rounded-2xl text-[11px] py-1"
              placeholder="جستجو در عنوان یا نام نویسنده..."
          />
        </div>
      </div>

      <div class="flex gap-2 text-[11px] sm:text-xs mt-2 flex-wrap">
        <button
            type="button"
            class="px-3 py-1 rounded-full border transition-colors whitespace-nowrap"
            :class="blogStatusFilter === 'all'
            ? 'bg-primary text-primary-content border-primary/70'
            : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'"
            @click="blogStatusFilter = 'all'"
        >
          همه مقالات
        </button>

        <button
            type="button"
            class="px-3 py-1 rounded-full border transition-colors whitespace-nowrap"
            :class="blogStatusFilter === 'published'
            ? 'bg-primary text-primary-content border-primary/70'
            : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'"
            @click="blogStatusFilter = 'published'"
        >
          مقالات منتشر شده
        </button>

        <button
            type="button"
            class="px-3 py-1 rounded-full border transition-colors whitespace-nowrap"
            :class="blogStatusFilter === 'draft'
            ? 'bg-primary text-primary-content border-primary/70'
            : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'"
            @click="blogStatusFilter = 'draft'"
        >
          مقالات در حال تدوین
        </button>
      </div>
    </section>

    <!-- LIST -->
    <section class="bg-base-100 rounded-3xl border border-base-300 p-4 sm:p-5 shadow-sm space-y-4 flex-grow" style="min-height: 430px;">
      <div class="flex items-center justify-between mb-1">
        <h3 class="font-semibold text-sm sm:text-base">مقالات</h3>
        <span class="text-[11px] text-base-content/60">{{ filteredBlogs.length }} مقاله در این لیست</span>
      </div>

      <div v-if="paginatedBlogs.length" class="grid gap-3 sm:gap-4 md:grid-cols-2">
        <article
            v-for="p in paginatedBlogs"
            :key="p.id"
            class="group rounded-2xl border border-base-300 bg-base-100/90 px-3.5 py-3 sm:px-4 sm:py-3.5 flex items-center justify-between gap-3 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 transition-all"
        >
          <div class="flex flex-col gap-1 min-w-0">
            <h4 class="text-xs sm:text-sm font-medium text-base-content truncate max-w-[220px]">
              {{ p.title }}
            </h4>
            <p class="text-[10px] sm:text-[11px] text-base-content/70 line-clamp-2">{{ p.excerpt }}</p>

            <div class="flex flex-wrap gap-1.5 text-[10px] sm:text-[11px] mt-1">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-base-200/80 text-base-content/70">
                نویسنده: <span class="ml-1">{{ p.author_name }}</span>
              </span>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-base-200/60 text-base-content/70">
                تاریخ: <span class="ml-1">{{ p.published_at_display }}</span>
              </span>
              <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="p.is_published ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'"
              >
                {{ p.is_published ? 'منتشر شده' : 'در حال تدوین' }}
              </span>
            </div>
          </div>

          <div class="flex flex-col items-end gap-1 text-[10px] sm:text-[11px] min-w-[120px]">
            <RouterLink :to="`/admin/blogs/${p.id}`" class="btn btn-xs btn-outline w-full justify-center">
              ویرایش
            </RouterLink>
            <button class="btn btn-xs btn-error w-full justify-center" @click="confirmRemove(p.id, p.title)">حذف</button>
          </div>
        </article>
      </div>

      <div v-else class="py-10 flex flex-col items-center justify-center gap-2 text-center text-xs text-base-content/60">
        <div class="h-16 w-16 rounded-3xl border border-dashed border-base-300 flex items-center justify-center mb-1">
          <div class="h-8 w-8 rounded-2xl bg-base-200"></div>
        </div>
        <p>مقاله‌ای با این شرایط پیدا نشد.</p>
        <p class="text-[11px] text-base-content/50">عبارت جستجو یا فیلتر را تغییر بده یا یک مطلب جدید اضافه کن.</p>
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

    <!-- DELETE MODAL -->
    <div v-if="deleteModal.open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-base-100 rounded-xl shadow-lg p-5 w-72 sm:w-80 flex flex-col gap-4">
        <h3 class="text-base font-semibold text-error">حذف مقاله</h3>
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
import { adminListBlogs, adminDeleteBlog } from '@/services/admin.ts'
import type { AdminBlogListItem } from '@/types/api_client_types/admin.dto.ts'

type BlogRow = Omit<AdminBlogListItem, 'is_published' | 'published_at'> & {
  is_published: boolean
  published_at?: string | null
  published_at_display: string
}

const toast = useToast()

const blogs = ref<BlogRow[]>([])
const q = ref('')
const currentPage = ref(1)
const blogsPerPage = 6
const blogStatusFilter = ref<'all' | 'published' | 'draft'>('all')

const deleteModal = ref<{ open: boolean; id: number; title: string }>({ open: false, id: 0, title: '' })

function formatDate(date?: string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fa-IR')
}

function normalizeIsPublished(v: any): boolean {
  if (typeof v === 'boolean') return v
  if (typeof v === 'string' && (v === 'true' || v === 'false')) return v === 'true'
  return Number(v) === 1
}

async function fetchBlogs() {
  try {
    const data = await adminListBlogs({ limit: 200, offset: 0 })


    blogs.value = (data as any[]).map((b) => ({
      ...b,
      title: b.title ?? 'بدون عنوان',
      excerpt: b.excerpt ?? '',
      author_name: b.author_name ?? 'نامشخص',
      published_at: b.published_at ?? null,
      is_published: normalizeIsPublished(b.is_published),
      published_at_display: formatDate(b.published_at ?? null),
    }))
  } catch (err: any) {
    console.error('خطا در دریافت مقالات:', err)
    toast.error(err?.response?.data?.message || 'خطا در دریافت مقالات')
  }
}

onMounted(fetchBlogs)

const totalBlogs = computed(() => blogs.value.length)

const filteredBlogs = computed(() => {
  const text = q.value.trim().toLowerCase()

  return blogs.value.filter((b) => {
    const title = (b.title ?? '').toLowerCase()
    const author = (b.author_name ?? '').toLowerCase()

    const matchText = !text || title.includes(text) || author.includes(text)

    const matchStatus =
        blogStatusFilter.value === 'all' ||
        (blogStatusFilter.value === 'published' && b.is_published === true) ||
        (blogStatusFilter.value === 'draft' && b.is_published === false)

    return matchText && matchStatus
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredBlogs.value.length / blogsPerPage)))

const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * blogsPerPage
  return filteredBlogs.value.slice(start, start + blogsPerPage)
})

function changePage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}

watch([q, blogStatusFilter], () => {
  currentPage.value = 1
})

watch(totalPages, (tp) => {
  if (currentPage.value > tp) currentPage.value = tp
})

function confirmRemove(id: number, title: string) {
  deleteModal.value = { open: true, id, title }
}

async function remove(id: number) {
  try {
    await adminDeleteBlog(id)
    const idx = blogs.value.findIndex((b) => b.id === id)
    if (idx >= 0) blogs.value.splice(idx, 1)
    deleteModal.value.open = false
    toast.success('مقاله حذف شد')
  } catch (err: any) {
    console.error('delete blog error:', err)
    toast.error(err?.response?.data?.message || 'حذف مقاله انجام نشد')
  }
}
</script>
