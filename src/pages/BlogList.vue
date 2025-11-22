<template>
  <div class="bg-base-200 min-h-screen pb-16" dir="rtl">
    <div class="max-w-6xl mx-auto px-4 lg:px-0 pt-8 space-y-8">

      <!-- HERO / HEADER -->
      <section class="relative overflow-hidden rounded-[28px] border border-base-300 bg-base-100 p-6 md:p-10">
        <div class="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-secondary/10 blur-3xl"></div>

        <div class="relative grid gap-6 md:grid-cols-[1.2fr,0.8fr] items-center">
          <div class="text-right space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-200/70 border border-base-300 w-fit mr-auto">
              <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
              <span class="text-[11px] text-base-content/70">MithraPay Blog</span>
            </div>

            <h1 class="text-2xl md:text-3xl font-extrabold leading-relaxed">
              بلاگ میتراپی
            </h1>
            <p class="text-sm md:text-base text-base-content/70 leading-7">
              آموزش‌ها، راهنماها و خبرهای دنیای سرویس‌های دیجیتال؛
              از استریم موسیقی و فیلم تا سرویس‌های اپل و گیفت‌کارت‌ها.
            </p>

            <!-- Search + Sort row -->
            <div class="pt-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
              <label class="input input-bordered flex items-center gap-2 w-full sm:w-[360px] bg-base-100">
                <svg class="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="7" stroke-width="2"></circle>
                  <path d="M20 20l-3.5-3.5" stroke-width="2" stroke-linecap="round"></path>
                </svg>
                <input
                    v-model="search"
                    type="text"
                    class="grow text-sm"
                    placeholder="جستجو در مطالب..."
                />
              </label>

              <select v-model="sort" class="select select-bordered w-full sm:w-52 bg-base-100">
                <option value="newest">جدیدترین</option>
                <option value="oldest">قدیمی‌تر</option>
                <option value="popular">محبوب‌ترین</option>
                <option value="mostViewed">پربازدیدترین</option>
                <option value="shortest">کوتاه‌ترین مطالعه</option>
                <option value="longest">طولانی‌ترین مطالعه</option>
                <option value="random">تصادفی</option>
              </select>
            </div>
          </div>

          <!-- quick stats -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-2xl bg-base-200/60 border border-base-300 p-4 text-right space-y-1">
              <p class="text-lg font-extrabold text-primary">{{ posts.length || 0 }}</p>
              <p class="text-[11px] text-base-content/60">مقاله</p>
            </div>
            <div class="rounded-2xl bg-base-200/60 border border-base-300 p-4 text-right space-y-1">
              <p class="text-lg font-extrabold text-primary">{{ categories.length || 0 }}</p>
              <p class="text-[11px] text-base-content/60">دسته</p>
            </div>
            <div class="rounded-2xl bg-base-200/60 border border-base-300 p-4 text-right space-y-1">
              <p class="text-lg font-extrabold text-primary">راهنما</p>
              <p class="text-[11px] text-base-content/60">آپدیت هفتگی</p>
            </div>
          </div>
        </div>
      </section>


      <div class="flex flex-col gap-6 lg:flex-row">

        <!-- MAIN -->
        <main class="flex-1 space-y-6">

          <!-- FEATURED POST (only on page 1) -->
          <article
              v-if="featuredPost"
              class="group bg-base-100 border border-base-300 rounded-[24px] overflow-hidden grid md:grid-cols-[1.05fr,0.95fr]"
          >
            <figure class="aspect-[16/9] md:aspect-auto bg-base-200 overflow-hidden">
              <img
                  :src="featuredPost.cover || 'https://placehold.co/1200x700?text=Featured'"
                  :alt="featuredPost.title"
                  class="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
              />
            </figure>

            <div class="p-5 md:p-6 text-right flex flex-col gap-3">
              <div class="flex items-center justify-between gap-3">
                <span class="badge badge-primary badge-sm rounded-full">
                  مطلب ویژه
                </span>
                <span v-if="featuredPost.category" class="badge badge-ghost badge-sm rounded-full">
                  {{ featuredPost.category }}
                </span>
              </div>

              <RouterLink
                  :to="`/blog/${featuredPost.slug}`"
                  class="text-lg md:text-xl font-bold leading-8 hover:text-primary transition line-clamp-2"
              >
                {{ featuredPost.title }}
              </RouterLink>

              <div class="flex flex-wrap gap-3 text-xs text-base-content/60 justify-end">
                <span>{{ formatDate(featuredPost.date || featuredPost.createdAt) }}</span>
                <span v-if="featuredPost.readingTime">• {{ featuredPost.readingTime }} دقیقه مطالعه</span>
                <span v-if="featuredPost.views">• {{ featuredPost.views }} بازدید</span>
              </div>

              <p class="text-sm text-base-content/70 leading-7 line-clamp-3">
                {{ getExcerpt(featuredPost) }}
              </p>

              <div class="mt-auto flex justify-end">
                <RouterLink
                    :to="`/blog/${featuredPost.slug}`"
                    class="btn btn-sm btn-primary rounded-full px-6"
                >
                  ادامه مطلب
                </RouterLink>
              </div>
            </div>
          </article>


          <!-- POSTS GRID -->
          <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

            <!-- Skeleton on loading -->
            <template v-if="loading">
              <div
                  v-for="i in 6"
                  :key="i"
                  class="bg-base-100 border border-base-300 rounded-2xl overflow-hidden"
              >
                <div class="aspect-[16/9] bg-base-200 animate-pulse"></div>
                <div class="p-4 space-y-3">
                  <div class="h-4 bg-base-200 animate-pulse rounded"></div>
                  <div class="h-3 bg-base-200 animate-pulse rounded w-2/3"></div>
                  <div class="h-3 bg-base-200 animate-pulse rounded w-5/6"></div>
                </div>
              </div>
            </template>

            <!-- Real posts (paged) -->
            <article
                v-else
                v-for="p in restPosts"
                :key="p.id || p.slug"
                class="group bg-base-100 border border-base-300 rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition duration-300"
            >
              <figure class="aspect-[16/9] bg-base-200 overflow-hidden relative">
                <img
                    :src="p.cover || 'https://placehold.co/800x450?text=Blog'"
                    :alt="p.title"
                    class="w-full h-full object-cover group-hover:scale-[1.04] transition duration-500"
                />
                <div v-if="p.category" class="absolute top-3 right-3">
                  <span class="badge badge-ghost badge-sm rounded-full bg-base-100/90">
                    {{ p.category }}
                  </span>
                </div>
              </figure>

              <div class="p-4 flex-1 flex flex-col gap-3 text-right">
                <RouterLink
                    :to="`/blog/${p.slug}`"
                    class="text-base font-semibold hover:text-primary transition line-clamp-2 leading-7"
                >
                  {{ p.title }}
                </RouterLink>

                <div class="flex flex-wrap gap-2 text-xs text-base-content/55 justify-end">
                  <span>{{ formatDate(p.date || p.createdAt) }}</span>
                  <span v-if="p.readingTime">• {{ p.readingTime }} دقیقه</span>
                  <span v-if="p.views">• {{ p.views }} بازدید</span>
                </div>

                <p class="text-sm text-base-content/70 line-clamp-3 leading-7">
                  {{ getExcerpt(p) }}
                </p>

                <div class="mt-auto flex justify-end">
                  <RouterLink
                      :to="`/blog/${p.slug}`"
                      class="btn btn-sm btn-outline rounded-full px-5"
                  >
                    ادامه مطلب
                  </RouterLink>
                </div>
              </div>
            </article>

            <!-- Empty state -->
            <div
                v-if="!loading && !filteredPosts.length"
                class="col-span-full bg-base-100 border border-base-200 rounded-2xl p-10 text-center text-sm text-base-content/60"
            >
              مطلبی پیدا نشد.
            </div>
          </div>

          <!-- ✅ Pagination bar -->
          <div v-if="!loading && totalPages > 1" class="pt-6 flex justify-center">
            <div class="join">
              <button
                  class="join-item btn btn-sm"
                  :disabled="currentPage === 1"
                  @click="goToPage(1)"
              >
                اول
              </button>

              <button
                  class="join-item btn btn-sm"
                  :disabled="currentPage === 1"
                  @click="prevPage"
              >
                قبلی
              </button>

              <button
                  v-for="p in visiblePages"
                  :key="p"
                  class="join-item btn btn-sm"
                  :class="p === currentPage ? 'btn-primary' : 'btn-ghost'"
                  @click="goToPage(p)"
              >
                {{ p }}
              </button>

              <button
                  class="join-item btn btn-sm"
                  :disabled="currentPage === totalPages"
                  @click="nextPage"
              >
                بعدی
              </button>

              <button
                  class="join-item btn btn-sm"
                  :disabled="currentPage === totalPages"
                  @click="goToPage(totalPages)"
              >
                آخر
              </button>
            </div>
          </div>
        </main>


        <!-- SIDEBAR -->
        <aside class="lg:w-72 shrink-0 space-y-5 order-first lg:order-last">
          <div class="sticky top-6 space-y-5">

            <!-- Categories -->
            <div class="bg-base-100 border border-base-300 rounded-2xl p-4 space-y-3">
              <p class="text-sm font-semibold text-right">دسته‌بندی‌ها</p>

              <div class="flex flex-wrap gap-2 justify-end">
                <button
                    class="btn btn-xs rounded-full"
                    :class="activeCat === '' ? 'btn-primary' : 'btn-ghost'"
                    @click="activeCat = ''"
                >
                  همه
                </button>

                <button
                    v-for="cat in categories"
                    :key="cat"
                    class="btn btn-xs rounded-full"
                    :class="activeCat === cat ? 'btn-primary' : 'btn-ghost'"
                    @click="activeCat = cat"
                >
                  {{ cat }}
                </button>
              </div>

              <p v-if="!categories.length" class="text-xs text-base-content/40 text-right">
                هنوز دسته‌ای تعریف نشده است.
              </p>
            </div>

            <!-- Small tips card -->
            <div class="bg-base-100 border border-base-300 rounded-2xl p-4 text-right space-y-2">
              <p class="text-sm font-semibold">راهنمای سریع</p>
              <p class="text-xs text-base-content/70 leading-6">
                با انتخاب دسته‌بندی‌ها یا جستجو، سریع‌تر به مقاله‌ی موردنظرتون برسید.
                مطالب جدید به‌صورت منظم اضافه می‌شن.
              </p>
            </div>

          </div>
        </aside>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { listPosts } from '@/services/api'
import type { BlogPost } from '@/services/types'

type SortKey =
    | 'newest'
    | 'oldest'
    | 'popular'
    | 'mostViewed'
    | 'shortest'
    | 'longest'
    | 'random'

const posts = ref<BlogPost[]>([])
const loading = ref(true)

const search = ref('')
const sort = ref<SortKey>('newest')
const activeCat = ref('')

// ✅ دسته‌بندی‌های پیش‌فرض پیشنهادی
const preferredCats = [
  'موسیقی و استریم',
  'فیلم و سریال',
  'اپل و آیکلود',
  'یوتیوب و شبکه‌های اجتماعی',
  'گیمینگ و گیفت‌کارت',
  'آموزش و راهنما',
  'اخبار و بروزرسانی‌ها',
  'نکته‌ها و ترفندها',
]

// ✅ Pagination
const pageSize = 9
const currentPage = ref(1)

onMounted(async () => {
  try {
    posts.value = await listPosts()
  } finally {
    loading.value = false
  }
})

// هر بار فیلتر/سرچ/سورت عوض شد، برگرد صفحه 1
watch([search, sort, activeCat, posts], () => {
  currentPage.value = 1
})

const categories = computed(() => {
  const s = new Set<string>()

  posts.value.forEach((p: any) => {
    if (p.category) s.add(p.category)
    if (Array.isArray(p.tags)) p.tags.forEach((t: string) => s.add(t))
  })

  if (s.size === 0) return preferredCats
  preferredCats.forEach(c => s.add(c))
  return Array.from(s)
})

const filteredPosts = computed(() => {
  let arr = [...posts.value]

  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    arr = arr.filter((p: any) =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.content && stripHtml(p.content).toLowerCase().includes(q))
    )
  }

  if (activeCat.value) {
    arr = arr.filter((p: any) => {
      const byCat = p.category === activeCat.value
      const byTag = Array.isArray(p.tags) && p.tags.includes(activeCat.value)
      return byCat || byTag
    })
  }

  arr.sort((a: any, b: any) => {
    const ad = new Date(a.date || a.createdAt || 0).getTime()
    const bd = new Date(b.date || b.createdAt || 0).getTime()

    const aViews = Number(a.views || 0)
    const bViews = Number(b.views || 0)

    const aLikes = Number(a.likes || 0)
    const bLikes = Number(b.likes || 0)

    const aRead = Number(a.readingTime || a.reading_minutes || 0)
    const bRead = Number(b.readingTime || b.reading_minutes || 0)

    switch (sort.value) {
      case 'newest': return bd - ad
      case 'oldest': return ad - bd
      case 'popular': return bLikes - aLikes || (bd - ad)
      case 'mostViewed': return bViews - aViews || (bd - ad)
      case 'shortest': return aRead - bRead || (bd - ad)
      case 'longest': return bRead - aRead || (bd - ad)
      case 'random': return Math.random() - 0.5
      default: return bd - ad
    }
  })

  return arr
})

// ✅ Pagination computed
const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredPosts.value.length / pageSize))
)

const pageSlice = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

// مطلب ویژه فقط صفحه اول
const featuredPost = computed(() =>
    currentPage.value === 1 ? filteredPosts.value[0] || null : null
)

const restPosts = computed(() => {
  if (!pageSlice.value.length) return []
  return currentPage.value === 1 ? pageSlice.value.slice(1) : pageSlice.value
})

// ✅ visible page numbers (max 5)
const visiblePages = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  const windowSize = 5

  let start = Math.max(1, cur - Math.floor(windowSize / 2))
  let end = start + windowSize - 1

  if (end > total) {
    end = total
    start = Math.max(1, end - windowSize + 1)
  }

  const pages: number[] = []
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

function goToPage(p: number) {
  currentPage.value = Math.min(Math.max(1, p), totalPages.value)
  // اسکرول نرم به بالا
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
function nextPage() {
  goToPage(currentPage.value + 1)
}
function prevPage() {
  goToPage(currentPage.value - 1)
}

function formatDate(val?: string) {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  return d.toLocaleDateString('fa-IR')
}

function getExcerpt(p: any) {
  if (p.excerpt) return p.excerpt
  if (p.description) return p.description
  if (p.content) return stripHtml(p.content).slice(0, 120) + '…'
  return ''
}

function stripHtml(html = '') {
  return html.replace(/<[^>]+>/g, '')
}
</script>
