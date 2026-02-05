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
              <span class="text-[11px] text-base-content/70">RedSkyBox Blog</span>
            </div>

            <h1 class="text-2xl md:text-3xl font-extrabold leading-relaxed">
              بلاگ رد اسکای باکس
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
              <p class="text-lg font-extrabold text-primary">{{ BLOG_CATEGORIES.length }}</p>
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
                  :src="coverSrc(featuredPost)"
                  :alt="featuredPost.title ?? ''"
                  class="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
                  @error="onImgError"
              />
            </figure>

            <div class="p-5 md:p-6 text-right flex flex-col gap-3">
              <div class="flex items-center justify-between gap-3">
                <span class="badge badge-primary badge-sm rounded-full">مطلب ویژه</span>

                <span v-if="categoryLabel(featuredPost)" class="badge badge-ghost badge-sm rounded-full">
                  {{ categoryLabel(featuredPost) }}
                </span>
              </div>

              <RouterLink
                  :to="`/blog/${featuredPost.slug}`"
                  class="text-lg md:text-xl font-bold leading-8 hover:text-primary transition line-clamp-2"
              >
                {{ featuredPost.title }}
              </RouterLink>

              <div class="flex flex-wrap gap-3 text-xs text-base-content/60 justify-end">
                <span>{{ formatDate(featuredPost.created_at) }}</span>
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
                  v-for="i in 7"
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
                    :src="coverSrc(p)"
                    :alt="p.title ?? ''"
                    class="w-full h-full object-cover group-hover:scale-[1.04] transition duration-500"
                    @error="onImgError"
                />

                <div v-if="categoryLabel(p)" class="absolute top-3 right-3">
                  <span class="badge badge-ghost badge-sm rounded-full bg-base-100/90">
                    {{ categoryLabel(p) }}
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
                  <span>{{ formatDate(p.created_at) }}</span>
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

          <!-- Pagination -->
          <div v-if="!loading && totalPages > 1" class="pt-6 flex justify-center">
            <div class="join">
              <button class="join-item btn btn-sm" :disabled="currentPage === 1" @click="prevPage">قبلی</button>

              <button
                  v-for="p in visiblePages"
                  :key="p"
                  class="join-item btn btn-sm"
                  :class="p === currentPage ? 'btn-primary' : 'btn-ghost'"
                  @click="goToPage(p)"
              >
                {{ p }}
              </button>

              <button class="join-item btn btn-sm" :disabled="currentPage === totalPages" @click="nextPage">بعدی</button>
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
                    :class="activeCatId === null ? 'btn-primary' : 'btn-ghost'"
                    @click="activeCatId = null"
                >
                  همه
                </button>

                <button
                    v-for="cat in BLOG_CATEGORIES"
                    :key="cat.id"
                    class="btn btn-xs rounded-full"
                    :class="activeCatId === cat.id ? 'btn-primary' : 'btn-ghost'"
                    @click="activeCatId = cat.id"
                >
                  {{ cat.name }}
                </button>
              </div>
            </div>

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
console.log('✅ BLOG PAGE SCRIPT LOADED', new Date().toISOString())

import { onMounted, ref, computed, watch } from 'vue'
import { listBlogPosts } from '@/services/blog.ts'
import type { BlogPostDto } from '@/types/api_client_types/blog.dto.ts'

type SortKey = 'newest' | 'oldest' | 'popular' | 'mostViewed' | 'shortest' | 'longest' | 'random'

const posts = ref<BlogPostDto[]>([])
const loading = ref(true)

const search = ref('')
const sort = ref<SortKey>('newest')
const activeCatId = ref<number | null>(null)

const BLOG_CATEGORIES = [
  { id: 1, name: 'موسیقی و استریم', slug: 'music-streaming' },
  { id: 2, name: 'فیلم و سریال', slug: 'movies-series' },
  { id: 3, name: 'اپل و آیکلود', slug: 'apple-icloud' },
  { id: 4, name: 'یوتیوب و شبکه‌های اجتماعی', slug: 'youtube-social' },
  { id: 5, name: 'گیمینگ و گیفت‌کارت', slug: 'gaming-giftcard' },
  { id: 6, name: 'آموزش و راهنما', slug: 'tutorials-guides' },
  { id: 7, name: 'اخبار و بروزرسانی‌ها', slug: 'news-updates' },
  { id: 8, name: 'نکته‌ها و ترفندها', slug: 'tips-tricks' },
] as const

const CAT_BY_ID = computed(() => {
  const m = new Map<number, { id: number; name: string; slug: string }>()
  BLOG_CATEGORIES.forEach(c => m.set(c.id, c))
  return m
})

function normalizeFa(input: any): string {
  if (input == null) return ''
  return String(input)
      .trim()
      .replace(/ي/g, 'ی')
      .replace(/ك/g, 'ک')
      .replace(/\u200c/g, ' ') // نیم‌فاصله
      .replace(/\s+/g, ' ')
      .trim()
}

function getPostCategoryId(p: any): number {
  const direct =
      p?.category_id ??
      p?.categoryId ??
      p?.categoryID ??
      p?.category?.id ??
      null

  const n = Number(direct || 0)
  if (Number.isFinite(n) && n > 0) return n

  // category به صورت متن
  const catText = normalizeFa(p?.category)
  if (catText) {
    const found = BLOG_CATEGORIES.find(c => normalizeFa(c.name) === catText)
    if (found) return found.id
  }

  // category داخل tags
  if (Array.isArray(p?.tags)) {
    const tags = p.tags.map((t: any) => normalizeFa(t))
    const found = BLOG_CATEGORIES.find(c => tags.includes(normalizeFa(c.name)))
    if (found) return found.id
  }

  return 0
}

function categoryLabel(p: any): string {
  const id = getPostCategoryId(p)
  if (!id) return ''
  return CAT_BY_ID.value.get(id)?.name || ''
}

const pageSize = 7
const currentPage = ref(1)

onMounted(async () => {
  console.log('🟡 onMounted start')
  loading.value = true

  try {
    const res = await listBlogPosts()
    posts.value = Array.isArray(res)
        ? res
        : (res as any)?.items ?? (res as any)?.data ?? (res as any)?.posts ?? []

    console.log('🧪 posts after set:', posts.value.length)
    console.log('🧪 extracted category ids:',
        posts.value.slice(0, 20).map((p: any) => ({
          id: p.id,
          slug: p.slug,
          catId: getPostCategoryId(p),
          raw: p.category_id ?? p.categoryId ?? p.category,
        }))
    )
  } catch (err) {
    console.error('🔴 listBlogPosts failed:', err)
  } finally {
    loading.value = false
    console.log('🟣 onMounted finally, loading:', loading.value)
  }
})

watch([search, sort, activeCatId, posts], () => {
  currentPage.value = 1
})

function stripHtml(input: any = '') {
  return String(input).replace(/<[^>]+>/g, ' ')
}

function decodeHtmlEntities(input: any) {
  const s = String(input ?? '')
  if (typeof document === 'undefined') return s
  const el = document.createElement('textarea')
  el.innerHTML = s
  return el.value
}

function toTextCandidate(input: any): string {
  if (input == null) return ''

  // ✅ اگر object/array بود، سعی کن محتواش رو قابل خواندن کنی
  if (typeof input === 'object') {
    // حالت‌های رایج ادیتورهای block-based
    if (Array.isArray((input as any)?.blocks)) {
      try {
        return (input as any).blocks
            .map((b: any) => b?.data?.text || b?.text || '')
            .filter(Boolean)
            .join(' ')
      } catch {
        // fallthrough
      }
    }

    // اگر content به شکل delta یا هر ساختار دیگه بود
    try {
      return JSON.stringify(input)
    } catch {
      return ''
    }
  }

  return String(input)
}

function cleanText(input: any) {
  let s = toTextCandidate(input)
  if (!s) return ''

  // ✅ decode (&lt;h2&gt; -> <h2>)
  s = decodeHtmlEntities(s)

  // حذف front-matter
  s = s.replace(/^---[\s\S]*?---\s*/m, '')

  // حذف handlebars/vue template tags مثل {{...}} یا <% %>
  s = s.replace(/{{[\s\S]*?}}/g, ' ')
  s = s.replace(/<%[\s\S]*?%>/g, ' ')

  // حذف HTML tags
  s = stripHtml(s)

  // جمع کردن فاصله‌ها
  s = s.replace(/\s+/g, ' ').trim()

  return s
}

function getExcerpt(p: any) {
  // ✅ اولویت: excerpt واقعی
  const ex = cleanText(p?.excerpt)
  if (ex.length) return ex.length > 140 ? ex.slice(0, 140) + '…' : ex

  // ✅ بعد: summary/description (اگر داشت)
  const desc = cleanText(p?.description || p?.summary)
  if (desc.length) return desc.length > 140 ? desc.slice(0, 140) + '…' : desc

  // ✅ آخر: content
  const body = cleanText(p?.content)
  if (body.length) return body.length > 140 ? body.slice(0, 140) + '…' : body

  return ''
}


const filteredPosts = computed(() => {
  let arr = [...posts.value] as any[]

  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    arr = arr.filter((p: any) =>
        (p.title && String(p.title).toLowerCase().includes(q)) ||
        (p.excerpt && String(p.excerpt).toLowerCase().includes(q)) ||
        (p.description && String(p.description).toLowerCase().includes(q)) ||
        (p.content && stripHtml(p.content).toLowerCase().includes(q))
    )
  }

  // ✅ فیلتر قطعی کتگوری با همان ساختار فرم ادمین (category_id)
  if (activeCatId.value !== null) {
    const selected = Number(activeCatId.value)
    arr = arr.filter((p: any) => getPostCategoryId(p) === selected)
  }

  arr.sort((a: any, b: any) => {
    const ad = new Date(a.created_at || 0).getTime()
    const bd = new Date(b.created_at || 0).getTime()

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

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / pageSize)))

const pageSlice = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

const featuredPost = computed(() => (currentPage.value === 1 ? filteredPosts.value[0] || null : null))

const restPosts = computed(() => {
  if (!pageSlice.value.length) return []
  return currentPage.value === 1 ? pageSlice.value.slice(1) : pageSlice.value
})

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
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
}
function nextPage() { goToPage(currentPage.value + 1) }
function prevPage() { goToPage(currentPage.value - 1) }

function formatDate(val?: string | null) {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val)
  return d.toLocaleDateString('fa-IR')
}


const PLACEHOLDER = 'https://placehold.co/800x450?text=Blog'
const ASSET_BASE =
    (import.meta as any).env?.VITE_ASSET_BASE_URL ||
    (import.meta as any).env?.VITE_API_BASE_URL ||
    ''

function looksLikeBadRoute(s: string) {
  return (
      s.startsWith('/blogs') ||
      s.startsWith('/blog') ||
      s.startsWith('/admin') ||
      s.startsWith('/products') ||
      s.startsWith('/api')
  )
}

function looksLikeImagePath(s: string) {
  const hasExt = /\.(png|jpe?g|webp|gif|svg|avif)(\?|#|$)/i.test(s)
  const looksMedia = /(upload|uploads|media|images|storage|static)/i.test(s)
  return hasExt || looksMedia
}

function coverSrc(p: any) {
  const raw =
      p?.cover_image ??
      p?.image_url ??
      p?.imageUrl ??
      p?.cover ??
      p?.coverUrl ??
      p?.cover_url ??
      p?.image ??
      p?.thumbnail ??
      p?.thumbnailUrl ??
      null

  if (!raw) return PLACEHOLDER

  const s = String(raw).trim()

  if (/^(https?:)?\/\//i.test(s) || s.startsWith('data:') || s.startsWith('blob:')) {
    return encodeURI(s)
  }

  if (looksLikeBadRoute(s) || !looksLikeImagePath(s)) {
    return PLACEHOLDER
  }

  const base = String(ASSET_BASE || '').replace(/\/$/, '')
  const path = s.startsWith('/') ? s : `/${s}`
  return base ? `${base}${path}` : path
}

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  console.warn('[Blog img error]', img?.src)
  if (img && img.src !== PLACEHOLDER) img.src = PLACEHOLDER
}
</script>
