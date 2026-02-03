<template>
  <section class="space-y-4" dir="rtl">
    <!-- Header -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-xl font-bold">نتایج جستجو</h1>

        <p class="text-sm text-base-content/70 mt-1 leading-6">
          <span v-if="effectiveQuery">
            برای
            <span
                class="font-semibold px-2 py-0.5 rounded-lg bg-base-200/60 font-mono"
                dir="auto"
                style="unicode-bidi: plaintext;"
            >
              {{ effectiveQuery }}
            </span>
            —
            {{ results.length.toLocaleString('fa-IR') }}
            نتیجه
          </span>

          <span v-else>
            برای شروع، عبارت مورد نظر رو جستجو کن.
          </span>
        </p>
      </div>

      <div class="flex gap-2 items-center">
        <select v-model="sort" class="select select-bordered select-sm" :disabled="!effectiveQuery">
          <option value="relevance">مرتبط‌ترین</option>
          <option value="newest">جدیدترین</option>
          <option value="price_asc">ارزان‌ترین</option>
          <option value="price_desc">گران‌ترین</option>
        </select>

        <button class="btn btn-ghost btn-sm" @click="clearSearch" :disabled="!effectiveQuery">
          پاک کردن
        </button>
      </div>
    </div>

    <!-- Search box -->
    <label class="input input-bordered w-full flex items-center gap-2 rounded-2xl">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.6"
            d="M21 21l-4.3-4.3m1.3-5.2a7.5 7.5 0 1 1-15 0a7.5 7.5 0 0 1 15 0Z"
        />
      </svg>

      <input
          v-model="localQ"
          type="text"
          class="grow"
          placeholder="جستجو…"
          inputmode="search"
          dir="auto"
          style="unicode-bidi: plaintext;"
      />

      <button v-if="localQ" class="btn btn-ghost btn-xs rounded-xl" @click="localQ = ''">✕</button>
    </label>

    <!-- Loading (فقط وقتی کاربر چیزی تایپ کرده) -->
    <div v-if="loading && effectiveQuery" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-for="i in 6" :key="i" class="card border border-base-300 bg-base-100">
        <div class="card-body">
          <div class="skeleton h-5 w-2/3"></div>
          <div class="skeleton h-4 w-1/2"></div>
          <div class="skeleton h-28 w-full mt-2"></div>
        </div>
      </div>
    </div>

    <!-- حالت پیش‌فرض -->
    <div v-else-if="!effectiveQuery" class="card border border-base-300 bg-base-100">
      <div class="card-body items-center text-center">
        <div class="text-4xl">🔎</div>
        <h3 class="font-bold">جستجو کن تا نتایج رو ببینی</h3>
        <p class="text-sm text-base-content/70">
          محصولات از API دریافت شده‌اند، ولی تا وقتی چیزی تایپ نکنی نمایش داده نمی‌شن.
        </p>
      </div>
    </div>

    <!-- خطا -->
    <div v-else-if="errorMsg" class="alert alert-error">
      {{ errorMsg }}
    </div>

    <!-- No results -->
    <div v-else-if="effectiveQuery && !results.length" class="card border border-base-300 bg-base-100">
      <div class="card-body items-center text-center">
        <div class="text-4xl">🫥</div>
        <h3 class="font-bold">موردی پیدا نشد</h3>
        <p class="text-sm text-base-content/70">
          املای کلمه رو چک کن یا عبارت کوتاه‌تری وارد کن.
        </p>
        <div class="mt-2 flex gap-2">
          <button class="btn btn-primary btn-sm" @click="clearSearch">پاک کردن جستجو</button>
          <button class="btn btn-ghost btn-sm" @click="suggestLooseSearch">جستجوی آزادتر</button>
        </div>
      </div>
    </div>

    <!-- Results -->
    <ProductGrid v-else :products="results" :highlight="effectiveQuery" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductGrid from '@/components/ProductGrid.vue'
import { listProducts } from '@/services/products.ts'

type SortMode = 'relevance' | 'newest' | 'price_asc' | 'price_desc'

const route = useRoute()
const router = useRouter()

/** query from route (برای وقتی از نوبار/لینک میای) */
const routeQ = computed(() => String(route.query.q || '').trim())

/** input محلی */
const localQ = ref(routeQ.value)

/** چیزی که باید سرچ و نمایش بر اساسش انجام شه: همون تایپ کاربر */
const effectiveQuery = computed(() => String(localQ.value || '').trim())

/** وقتی route عوض شد (مثلاً از navbar)، input رو sync کن */
watch(routeQ, (v) => {
  if (v !== localQ.value) localQ.value = v
})

/** debounce -> sync به route برای shareable URL */
let t: number | undefined
watch(localQ, (v) => {
  window.clearTimeout(t)
  t = window.setTimeout(() => {
    const nv = String(v || '').trim()
    const nextQuery = { ...route.query }
    if (nv) nextQuery.q = nv
    else delete nextQuery.q
    router.replace({ query: nextQuery })
  }, 250)
})

/** sort */
const sort = ref<SortMode>('relevance')

/** ---- API cache ---- */
const loading = ref(false)
const errorMsg = ref('')
const allProducts = ref<any[]>([])

async function loadAllProducts() {
  if (loading.value) return
  loading.value = true
  errorMsg.value = ''

  try {
    const limit = 200
    let offset = 0
    let out: any[] = []
    let safety = 0

    while (safety < 200) {
      safety++
      const data: any = await listProducts({ limit, offset } as any)

      const items: any[] =
          (data?.items as any[]) ??
          (data?.products as any[]) ??
          (data?.data as any[]) ??
          (Array.isArray(data) ? data : [])

      out = out.concat(items)

      const total = Number(data?.total ?? data?.count ?? data?.meta?.total ?? data?.pagination?.total ?? NaN)
      offset += items.length || limit

      if (Number.isFinite(total)) {
        if (out.length >= total) break
      } else {
        if (items.length < limit) break
      }
      if (!items.length) break
    }

    allProducts.value = out
  } catch (e: any) {
    errorMsg.value = e?.message || 'خطا در دریافت محصولات'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAllProducts()
})

/** ---- Search helpers (title + category فقط) ---- */
function normalizeFa(input: string) {
  return String(input || '')
      .toLowerCase()
      .replace(/[\u200c\u200d\u200e\u200f]/g, ' ')
      .replace(/[ي]/g, 'ی')
      .replace(/[ك]/g, 'ک')
      .replace(/[ۀ]/g, 'ه')
      .replace(/[\s]+/g, ' ')
      .trim()
}

function tokenize(q: string) {
  const n = normalizeFa(q)
  if (!n) return []
  return n.split(' ').filter(Boolean)
}

function includesAllTokens(haystack: string, tokens: string[]) {
  return tokens.every((tok) => haystack.includes(tok))
}

function scoreProduct(p: any, tokens: string[], qRaw: string) {
  const title = normalizeFa(p.title || '')
  const cat = normalizeFa(p.category?.title || p.category || '')

  let score = 0
  for (const tok of tokens) {
    if (title.includes(tok)) score += 6
    if (cat.includes(tok)) score += 3
  }

  const qn = normalizeFa(qRaw)
  if (qn && title.startsWith(qn)) score += 6
  return score
}

const results = computed(() => {
  const q = effectiveQuery.value
  if (!q) return []

  const all = allProducts.value || []
  const tokens = tokenize(q)
  if (!tokens.length) return []

  const filtered = all.filter((p: any) => {
    const hay = normalizeFa([p.title, p.category?.title ?? p.category].filter(Boolean).join(' '))
    return includesAllTokens(hay, tokens)
  })

  return applySort(filtered, tokens, q)
})

function applySort(list: any[], tokens: string[], qRaw: string) {
  switch (sort.value) {
    case 'newest':
      return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    case 'price_asc':
      return list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
    case 'price_desc':
      return list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
    case 'relevance':
    default:
      return list
          .map((p) => ({ p, s: scoreProduct(p, tokens, qRaw) }))
          .sort((a, b) => b.s - a.s)
          .map((x) => x.p)
  }
}

function clearSearch() {
  localQ.value = ''
  const nextQuery = { ...route.query }
  delete nextQuery.q
  router.replace({ query: nextQuery })
}

function suggestLooseSearch() {
  const tokens = tokenize(localQ.value)
  if (tokens.length > 1) localQ.value = tokens[0]
}

/** اگر کاربر سرچ کرد و هنوز محصولات نیومده بود، دوباره تلاش کن */
watch(
    () => effectiveQuery.value,
    (q) => {
      if (q && !allProducts.value.length && !loading.value) loadAllProducts()
    }
)
</script>
