<template>
  <div class="min-h-screen bg-base-200" dir="rtl">
    <!-- Animated background -->
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="grain"></div>
    </div>

    <!-- Reading progress -->
    <div class="fixed top-0 left-0 right-0 z-[90] h-1 bg-base-300/30">
      <div class="h-full bg-primary transition-all" :style="{ width: progress + '%' }"></div>
    </div>

    <!-- Blog Top Bar (sticky فقط در Zen) -->
    <header :class="zen ? 'sticky top-0 z-[80]' : ''" class="relative border-b border-base-300 bg-base-100/70 backdrop-blur">
      <div class="max-w-6xl mx-auto px-4 lg:px-6 py-3">
        <div class="flex items-center justify-between gap-3 overflow-visible" dir="ltr">
          <div class="flex items-center gap-2" dir="rtl">
            <div class="relative">
              <button
                  ref="aaBtnRef"
                  type="button"
                  class="btn btn-ghost btn-sm rounded-2xl"
                  @click="toggleAa"
              >
                Aa
              </button>

              <teleport to="body">
                <div v-if="aaOpen" class="fixed z-[9999]" :style="aaMenuStyle">
                  <div class="p-3 w-64 rounded-2xl border border-base-300 bg-base-100 shadow-xl space-y-3" dir="rtl">
                    <div class="text-xs text-base-content/60">اندازه متن</div>
                    <div class="flex items-center gap-2">
                      <button class="btn btn-ghost btn-xs rounded-xl no-hover" @click="decFont">A-</button>

                      <div class="flex-1 h-2 rounded-full bg-base-200 overflow-hidden">
                        <div class="h-full bg-primary" :style="{ width: ((fontStep + 1) / 3) * 100 + '%' }"></div>
                      </div>

                      <button class="btn btn-ghost btn-xs rounded-xl no-hover" @click="incFont">A+</button>
                    </div>

                    <div class="text-xs text-base-content/60">فاصله خطوط</div>
                    <div class="flex items-center gap-2">
                      <button class="btn btn-ghost btn-xs rounded-xl no-hover" @click="leadingStep = clamp(leadingStep - 1, 0, 2)">کم</button>
                      <button class="btn btn-ghost btn-xs rounded-xl no-hover" @click="leadingStep = 1">نرمال</button>
                      <button class="btn btn-ghost btn-xs rounded-xl no-hover" @click="leadingStep = clamp(leadingStep + 1, 0, 2)">زیاد</button>
                    </div>
                  </div>
                </div>
              </teleport>
            </div>

            <RouterLink to="/blog" class="btn btn-ghost btn-sm rounded-2xl">
              بازگشت
            </RouterLink>
          </div>

          <div class="flex items-center gap-2 min-w-0 justify-end text-right" dir="rtl">
            <RouterLink to="/blog" class="btn btn-ghost btn-sm rounded-2xl px-3 no-hover">بلاگ</RouterLink>
            <span class="opacity-60 text-sm">/</span>
            <span class="line-clamp-1 max-w-[52ch] text-sm font-bold text-base-content">
              {{ post.title }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
      <!-- HERO -->
      <section class="relative overflow-hidden rounded-3xl border border-base-300 shadow-2xl">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/12 via-secondary/10 to-transparent"></div>

        <div class="relative grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-7 lg:p-10 bg-base-100/70 backdrop-blur">
          <!-- Text -->
          <div class="lg:col-span-6 space-y-4">
            <h1 class="text-2xl sm:text-3xl lg:text-5xl font-extrabold leading-relaxed">
              {{ post.title }}
            </h1>

            <!-- ✅ excerpt justify -->
            <p class="!mt-8 text-base-content/75 leading-8 max-w-md text-right text-justify [text-align-last:right]">
              {{ post.excerpt }}
            </p>

            <!-- meta row -->
            <div class="!mt-8 flex flex-wrap items-center gap-3 text-sm text-base-content/60">
              <time>{{ prettyDate }}</time>

              <span class="opacity-40">•</span>
              <span>{{ readingTime }} دقیقه مطالعه</span>

              <span class="opacity-40">•</span>
              <span class="font-medium text-base-content/70">{{ post.author.name }}</span>
            </div>


            <div class="pt-2 flex flex-wrap gap-2">
              <button class="btn btn-primary rounded-2xl" @click="scrollToArticle">شروع خواندن</button>

              <button class="btn btn-ghost rounded-2xl border border-base-300" @click="toggleZen">
                {{ zen ? 'خروج از مطالعه' : 'حالت مطالعه' }}
              </button>
            </div>

            <div class="flex flex-wrap gap-2 pt-1">
              <span v-for="t in post.tags" :key="t" class="badge badge-ghost border border-base-300">
                {{ t }}
              </span>
            </div>
          </div>

          <!-- Cover -->
          <div class="lg:col-span-6">
            <div class="relative rounded-3xl overflow-hidden border border-base-300 shadow-xl bg-base-100">
              <img
                  :src="post.cover"
                  class="w-full object-cover h-56 sm:h-64 lg:h-[320px]"
                  alt="cover"
                  @error="onCoverError"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-base-100/35 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Content -->
      <section ref="contentStartRef" class="mt-6">
        <!-- Zen -->
        <div v-if="zen" class="grid grid-cols-1">
          <article class="bg-base-100 border border-base-300 rounded-3xl shadow-xl p-5 sm:p-7 lg:p-10">
            <div ref="articleRef">
              <div
                  :key="fontStep + '-' + leadingStep"
                  class="prose prose-invert prose-headings:scroll-mt-24 mx-auto justify-all"
                  :class="[proseWidthClass, proseLeadingClass]"
                  :style="{ fontSize: fontPx + 'px' }"
                  v-html="post.content"
              ></div>
            </div>

            <div class="mt-8 pt-5 border-t border-base-300 flex items-center justify-end gap-2">
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-sm rounded-2xl">اشتراک‌گذاری</label>
                <div tabindex="0" class="dropdown-content mt-2 w-[320px] rounded-2xl border border-base-300 bg-base-100 shadow-xl p-3 z-[9999]">
                  <div class="text-sm font-bold">اشتراک‌گذاری</div>
                  <div class="mt-2 join w-full">
                    <input class="input input-bordered join-item w-full" :value="currentUrl" readonly />
                    <button class="btn btn-primary join-item" @click="copyLink">کپی</button>
                  </div>
                  <div class="mt-3 grid grid-cols-3 gap-2">
                    <a :href="share.telegram" target="_blank" class="btn btn-ghost btn-sm rounded-xl">تلگرام</a>
                    <a :href="share.whatsapp" target="_blank" class="btn btn-ghost btn-sm rounded-xl">واتساپ</a>
                    <a :href="share.twitter" target="_blank" class="btn btn-ghost btn-sm rounded-xl">توییتر</a>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Normal -->
        <div v-else class="flex flex-col lg:flex-row gap-6 items-start">
          <!-- Sidebar -->
          <aside class="w-full lg:w-[300px] space-y-5 lg:sticky lg:top-6 order-2 lg:order-1">
            <div class="bg-base-100 border border-base-300 rounded-3xl shadow p-4">
              <div class="flex items-center justify-between">
                <div class="font-bold">فهرست</div>
              </div>

              <div v-if="!toc.length" class="mt-3 text-sm text-base-content/60 leading-7">
                تیترها پیدا نشد. داخل محتوا h2/h3 بذار.
              </div>

              <ul v-else class="mt-3 space-y-1">
                <li v-for="item in toc" :key="item.id">
                  <button
                      class="w-full text-right px-3 py-2 rounded-2xl transition border"
                      :class="item.id === activeId
                      ? 'bg-primary/10 border-primary/20 text-base-content'
                      : 'border-transparent hover:bg-base-200/60 text-base-content/70'"
                      @click="scrollToId(item.id)"
                  >
                    <span :class="item.level === 3 ? 'pr-4' : ''">{{ item.text }}</span>
                  </button>
                </li>
              </ul>
            </div>

            <div class="bg-base-100 border border-base-300 rounded-3xl shadow p-4">
              <div class="flex items-center justify-between">
                <div class="font-bold">مطالب مرتبط</div>
                <RouterLink class="link link-hover text-sm text-base-content/60" to="/blog">همه</RouterLink>
              </div>

              <div class="mt-4 space-y-3">
                <RouterLink v-for="p in related" :key="p.id" :to="`/blog/${p.slug}`" class="block group">
                  <div class="flex items-start gap-3">
                    <img
                        :src="p.cover"
                        class="w-14 h-14 rounded-2xl object-cover border border-base-300"
                        alt=""
                        @error="onRelatedImgError"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="font-bold text-sm leading-7 group-hover:underline line-clamp-2">{{ p.title }}</div>
                      <div class="text-xs text-base-content/60 mt-1">{{ p.meta }}</div>
                    </div>
                  </div>
                </RouterLink>
              </div>
            </div>
          </aside>

          <!-- Article -->
          <article class="flex-1 bg-base-100 border border-base-300 rounded-3xl shadow-xl p-5 sm:p-7 lg:p-10 order-1 lg:order-2">
            <div ref="articleRef">
              <div
                  :key="fontStep + '-' + leadingStep"
                  class="prose prose-invert prose-headings:scroll-mt-24 mx-auto justify-all"
                  :class="[proseWidthClass, proseLeadingClass]"
                  :style="{ fontSize: fontPx + 'px' }"
                  v-html="post.content"
              ></div>
            </div>

            <div class="mt-8 pt-5 border-t border-base-300 flex items-center justify-end gap-2">
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-sm rounded-2xl">اشتراک‌گذاری</label>
                <div tabindex="0" class="dropdown-content mt-2 w-[320px] rounded-2xl border border-base-300 bg-base-100 shadow-xl p-3 z-[9999]">
                  <div class="text-sm font-bold">اشتراک‌گذاری</div>
                  <div class="mt-2 join w-full">
                    <input class="input input-bordered join-item w-full" :value="currentUrl" readonly />
                    <button class="btn btn-primary join-item" @click="copyLink">کپی</button>
                  </div>
                  <div class="mt-3 grid grid-cols-3 gap-2">
                    <a :href="share.telegram" target="_blank" class="btn btn-ghost btn-sm rounded-xl">تلگرام</a>
                    <a :href="share.whatsapp" target="_blank" class="btn btn-ghost btn-sm rounded-xl">واتساپ</a>
                    <a :href="share.twitter" target="_blank" class="btn btn-ghost btn-sm rounded-xl">توییتر</a>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>

    <div v-if="toast" class="toast toast-top toast-end z-[99]">
      <div class="alert alert-success rounded-2xl shadow">
        <span>{{ toast }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getBlogPost, listBlogPosts } from '@/services/blog'
import type { BlogPostDto } from '@/types/api_client_types/blog.dto'

type TocItem = { id: string; text: string; level: 2 | 3 }

type ViewPost = {
  slug: string
  title: string
  excerpt: string
  cover: string
  tags: string[]
  publishedAt: Date
  author: { name: string }
  content: string
  category?: string | null
}

const route = useRoute()

const zen = ref(false)
const toast = ref('')
let toastTimer: number | null = null

const progress = ref(0)
let onScroll: (() => void) | null = null

const contentStartRef = ref<HTMLElement | null>(null)
const articleRef = ref<HTMLElement | null>(null)

const toc = ref<TocItem[]>([])
const activeId = ref('')
let io: IntersectionObserver | null = null

// ✅ ASSET BASE (برای عکس‌های نسبی)
const ASSET_BASE =
    (import.meta as any).env?.VITE_ASSET_BASE_URL ||
    (import.meta as any).env?.VITE_API_BASE_URL ||
    ''

const FALLBACK_COVER =
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=2000&q=70'

function setToast(msg: string) {
  toast.value = msg
  if (toastTimer) window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.value = ''), 1400)
}

const currentUrl = computed(() => window.location.href)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    setToast('لینک کپی شد')
  } catch {
    setToast('کپی ناموفق بود')
  }
}

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function scrollToArticle() {
  contentStartRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function setupProgress() {
  onScroll = () => {
    const doc = document.documentElement
    const scrollTop = doc.scrollTop || document.body.scrollTop
    const height = doc.scrollHeight - doc.clientHeight
    const p = height > 0 ? (scrollTop / height) * 100 : 0
    progress.value = Math.min(100, Math.max(0, Math.round(p)))
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

function buildToc() {
  toc.value = []
  activeId.value = ''

  const root = articleRef.value
  if (!root) return

  const headings = Array.from(root.querySelectorAll('h2, h3')) as HTMLHeadingElement[]
  const items: TocItem[] = []

  headings.forEach((h, idx) => {
    const level = (h.tagName.toLowerCase() === 'h3' ? 3 : 2) as 2 | 3
    const text = (h.textContent || '').trim()
    if (!text) return

    const base = text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .trim()
        .replace(/\s+/g, '-')

    const id = h.id || `${base || 'section'}-${idx + 1}`
    h.id = id
    items.push({ id, text, level })
  })

  toc.value = items

  if (io) io.disconnect()
  io = new IntersectionObserver(
      (entries) => {
        const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0]
        if (visible?.target?.id) activeId.value = visible.target.id
      },
      { rootMargin: '-12% 0px -75% 0px', threshold: [0.1, 0.2, 0.3] }
  )

  headings.forEach((h) => io?.observe(h))
}

/** ====== Zen ====== */
const zenCompensate = ref(0)
function getAppNavbar() { return document.getElementById('app-navbar') }
function getNavbarHeight() {
  const nav = getAppNavbar()
  if (!nav) return 0
  return Math.round(nav.getBoundingClientRect().height || 0)
}
function isNavbarStuck() {
  const nav = getAppNavbar()
  if (!nav) return false
  const rect = nav.getBoundingClientRect()
  return Math.abs(rect.top) <= 1
}
function applyZenToSiteNavbar(isZen: boolean) {
  document.documentElement.classList.toggle('zen-reading', isZen)
}
function toggleZen() {
  const h = getNavbarHeight()
  const shouldCompensate = window.scrollY > 6 && isNavbarStuck() && h > 0

  zen.value = !zen.value
  if (zen.value && shouldCompensate) zenCompensate.value = h
  applyZenToSiteNavbar(zen.value)

  if (zen.value && zenCompensate.value) {
    const d = zenCompensate.value
    requestAnimationFrame(() => window.scrollBy(0, d))
  } else if (!zen.value && zenCompensate.value) {
    const d = zenCompensate.value
    zenCompensate.value = 0
    requestAnimationFrame(() => window.scrollBy(0, -d))
  }

  setToast(zen.value ? 'حالت مطالعه فعال شد' : 'حالت مطالعه غیرفعال شد')
  nextTick(() => buildToc())
}

/** ====== Aa ====== */
const fontStep = ref(0) // -1..2
const leadingStep = ref(1) // 0..2
function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)) }
function incFont() { fontStep.value = clamp(fontStep.value + 1, -1, 2) }
function decFont() { fontStep.value = clamp(fontStep.value - 1, -1, 2) }

const fontPx = computed(() => (fontStep.value === -1 ? 15 : fontStep.value === 0 ? 16 : fontStep.value === 1 ? 18 : 20))
const proseLeadingClass = computed(() => (leadingStep.value === 0 ? 'leading-8' : leadingStep.value === 1 ? 'leading-9' : 'leading-10'))
const proseWidthClass = computed(() => (zen.value ? 'max-w-none lg:px-10' : 'max-w-[900px]'))

const aaOpen = ref(false)
const aaBtnRef = ref<HTMLElement | null>(null)
const aaPos = ref({ top: 0, left: 0 })
const aaMenuStyle = computed(() => ({ top: aaPos.value.top + 'px', left: aaPos.value.left + 'px', transform: 'translateX(-100%)' }))
function updateAaPos() {
  const btn = aaBtnRef.value
  if (!btn) return
  const r = btn.getBoundingClientRect()
  aaPos.value = { top: Math.round(r.bottom + 8), left: Math.round(r.right) }
}
function toggleAa() {
  aaOpen.value = !aaOpen.value
  if (aaOpen.value) updateAaPos()
}
function onViewportChange() { if (aaOpen.value) updateAaPos() }

/** ==============================
 *  ✅ Image URL helpers
 *  ============================== */

function isAbsUrl(s: string) {
  return /^(https?:)?\/\//i.test(s) || s.startsWith('data:') || s.startsWith('blob:')
}
function joinAssetUrl(raw: string) {
  const s = String(raw || '').trim()
  if (!s) return ''
  if (isAbsUrl(s)) return encodeURI(s)

  const base = String(ASSET_BASE || '').replace(/\/$/, '')
  const path = s.startsWith('/') ? s : `/${s}`
  return base ? `${base}${path}` : path
}
function coverSrc(dto: any): string {
  const raw =
      dto?.cover_image ??
      dto?.coverImage ??
      dto?.image_url ??
      dto?.imageUrl ??
      dto?.cover ??
      dto?.coverUrl ??
      dto?.cover_url ??
      dto?.image ??
      dto?.thumbnail ??
      dto?.thumbnailUrl ??
      null

  const s = String(raw || '').trim()
  if (!s) return FALLBACK_COVER
  const out = joinAssetUrl(s)
  return out || FALLBACK_COVER
}
function normalizeHtmlContent(html: string): string {
  if (!html) return ''
  return String(html).replace(/<img\b([^>]*?)\bsrc\s*=\s*["']([^"']+)["']([^>]*?)>/gi, (m, a, src, b) => {
    const fixed = isAbsUrl(src) ? src : joinAssetUrl(src)
    return `<img ${a} src="${fixed}" ${b}>`
  })
}

function asDate(input?: string | null) {
  if (!input) return new Date()
  const d = new Date(input)
  return isNaN(d.getTime()) ? new Date() : d
}

function extractTags(dto: BlogPostDto): string[] {
  const anyDto = dto as any
  if (Array.isArray(anyDto.tags)) return anyDto.tags.filter((x: any) => typeof x === 'string')
  if (Array.isArray(anyDto.tag_list)) return anyDto.tag_list.filter((x: any) => typeof x === 'string')
  if (typeof anyDto.category === 'string' && anyDto.category.trim()) return [anyDto.category.trim()]
  return []
}
function extractAuthorName(dto: BlogPostDto): string {
  const anyDto = dto as any
  const n1 = anyDto.author_name
  const n2 = anyDto.author?.name
  const n3 = anyDto.author
  if (typeof n1 === 'string' && n1.trim()) return n1.trim()
  if (typeof n2 === 'string' && n2.trim()) return n2.trim()
  if (typeof n3 === 'string' && n3.trim()) return n3.trim()
  return 'نام نویسنده'
}

function mapDtoToView(dto: BlogPostDto): ViewPost {
  const anyDto = dto as any
  const contentRaw = (dto.content ?? '').toString()
  return {
    slug: dto.slug,
    title: (dto.title ?? 'بدون عنوان').toString(),
    excerpt: (dto.excerpt ?? '').toString(),
    cover: coverSrc(anyDto),
    tags: extractTags(dto),
    publishedAt: asDate(anyDto.published_at ?? dto.created_at ?? dto.updated_at),
    author: { name: extractAuthorName(dto) },
    content: normalizeHtmlContent(contentRaw),
    category: anyDto.category ?? null
  }
}

const post = ref<ViewPost>({
  slug: '',
  title: 'در حال بارگذاری...',
  excerpt: '',
  cover: FALLBACK_COVER,
  tags: [],
  publishedAt: new Date(),
  author: { name: '—' },
  content: ''
})

const prettyDate = computed(() =>
    post.value.publishedAt.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
)

const readingTime = computed(() => {
  const html = post.value.content || ''
  const text = html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

  const words = text ? text.split(' ').filter(Boolean).length : 0
  return Math.max(1, Math.round(words / 200))
})

const share = computed(() => {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(post.value.title)
  return {
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    telegram: `https://t.me/share/url?url=${url}&text=${title}`,
    whatsapp: `https://wa.me/?text=${title}%20${url}`
  }
})

type RelatedItem = { id: number | string; slug: string; title: string; meta: string; cover: string }
const related = ref<RelatedItem[]>([])

function buildMeta(dto: BlogPostDto) {
  const anyDto = dto as any
  const d = asDate(anyDto.published_at ?? dto.created_at ?? dto.updated_at)
  const dateFa = d.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })
  const cat = (anyDto.category ?? '').toString().trim()
  return cat ? `${dateFa} • ${cat}` : `${dateFa}`
}

async function fetchPostBySlug(slug: string) {
  try {
    const dto = await getBlogPost(slug)
    post.value = mapDtoToView(dto)

    await nextTick()
    buildToc()
  } catch (e) {
    console.error('getBlogPost error:', e)
    setToast('دریافت مقاله ناموفق بود')
  }
}

async function fetchRelated(currentSlug: string) {
  try {
    const list = await listBlogPosts()
    const items = (list || [])
        .filter((x: any) => x?.slug && x.slug !== currentSlug)
        .slice(0, 2)
        .map((x: any) => ({
          id: x.id ?? x.slug,
          slug: x.slug,
          title: (x.title ?? 'بدون عنوان').toString(),
          meta: buildMeta(x),
          cover: coverSrc(x)
        }))

    related.value = items
  } catch (e) {
    console.error('listBlogPosts error:', e)
  }
}

function onCoverError(e: Event) {
  const img = e.target as HTMLImageElement
  if (img && img.src !== FALLBACK_COVER) img.src = FALLBACK_COVER
}
function onRelatedImgError(e: Event) {
  const img = e.target as HTMLImageElement
  if (img && img.src !== FALLBACK_COVER) img.src = FALLBACK_COVER
}

onMounted(async () => {
  await nextTick()
  setupProgress()

  const slug = String(route.params.slug ?? '')
  if (slug) {
    await fetchPostBySlug(slug)
    await fetchRelated(slug)
  } else {
    setToast('slug مقاله پیدا نشد')
  }

  window.addEventListener('scroll', onViewportChange, { passive: true })
  window.addEventListener('resize', onViewportChange)
})

watch(
    () => route.params.slug,
    async (newSlug) => {
      const slug = String(newSlug ?? '')
      if (!slug) return
      await fetchPostBySlug(slug)
      await fetchRelated(slug)
    }
)

onBeforeUnmount(() => {
  if (io) io.disconnect()
  if (onScroll) window.removeEventListener('scroll', onScroll)
  if (toastTimer) window.clearTimeout(toastTimer)
  applyZenToSiteNavbar(false)

  window.removeEventListener('scroll', onViewportChange)
  window.removeEventListener('resize', onViewportChange)
})
</script>

<style scoped>
.orb { position: absolute; border-radius: 9999px; filter: blur(60px); opacity: 0.55; animation: float 10s ease-in-out infinite; }
.orb-1 { width: 520px; height: 520px; top: -140px; right: -180px; background: rgba(99, 102, 241, 0.35); animation-duration: 12s; }
.orb-2 { width: 620px; height: 620px; bottom: -220px; left: -220px; background: rgba(236, 72, 153, 0.22); animation-duration: 14s; }
.orb-3 { width: 420px; height: 420px; top: 35%; left: 55%; background: rgba(34, 197, 94, 0.18); animation-duration: 16s; }
@keyframes float { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(18px,-14px,0) scale(1.05); } }

.grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
  opacity: 0.10;
  mix-blend-mode: overlay;
  pointer-events: none;
}

.no-hover:hover,
.no-hover:focus-visible { background-color: transparent !important; }

/* ✅ Justify ALL readable content */
.justify-all :deep(p),
.justify-all :deep(li),
.justify-all :deep(blockquote) {
  text-align: justify;
  text-justify: inter-word;
  direction: rtl;
  text-align-last: right;
}

/* ✅ Keep headings right + readable sizes */
.justify-all :deep(h2) {
  text-align: right;
  text-align-last: right;
  font-size: 1.55rem;
  font-weight: 900;
  margin: 1.4rem 0 0.7rem;
  line-height: 1.55;
}
.justify-all :deep(h3) {
  text-align: right;
  text-align-last: right;
  font-size: 1.25rem;
  font-weight: 850;
  margin: 1.1rem 0 0.55rem;
  line-height: 1.7;
}

/* ✅ Article images */
.justify-all :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 1rem;
  margin: 0.8rem 0;
  border: 1px solid hsl(var(--b3, 0 0% 80%) / 0.6);
}
</style>

<style>
html.zen-reading #app-navbar {
  position: relative !important;
  top: auto !important;
  z-index: auto !important;
}
</style>
