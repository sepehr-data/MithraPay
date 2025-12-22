<template>
  <section class="space-y-4" dir="rtl">
    <!-- Header -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-xl font-bold">نتایج جستجو</h1>

        <p class="text-sm text-base-content/70 mt-1 leading-6">
          <span v-if="query">
            برای
            <span
                class="font-semibold px-2 py-0.5 rounded-lg bg-base-200/60 font-mono"
                dir="auto"
                style="unicode-bidi: plaintext;"
            >
              {{ query }}
            </span>
            —
            {{ results.length.toLocaleString('fa-IR') }}
            نتیجه
          </span>

          <span v-else>
            همه محصولات — {{ results.length.toLocaleString('fa-IR') }} مورد
          </span>
        </p>
      </div>

      <div class="flex gap-2 items-center">
        <select v-model="sort" class="select select-bordered select-sm">
          <option value="relevance">مرتبط‌ترین</option>
          <option value="newest">جدیدترین</option>
          <option value="price_asc">ارزان‌ترین</option>
          <option value="price_desc">گران‌ترین</option>
        </select>

        <button class="btn btn-ghost btn-sm" @click="clearSearch" :disabled="!query">
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

    <!-- States -->
    <div v-if="store.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-for="i in 6" :key="i" class="card border border-base-300 bg-base-100">
        <div class="card-body">
          <div class="skeleton h-5 w-2/3"></div>
          <div class="skeleton h-4 w-1/2"></div>
          <div class="skeleton h-28 w-full mt-2"></div>
        </div>
      </div>
    </div>

    <div v-else-if="!results.length" class="card border border-base-300 bg-base-100">
      <div class="card-body items-center text-center">
        <div class="text-4xl">🫥</div>
        <h3 class="font-bold">موردی پیدا نشد</h3>
        <p class="text-sm text-base-content/70">
          املای کلمه رو چک کن یا عبارت کوتاه‌تری وارد کن.
        </p>
        <div class="mt-2 flex gap-2">
          <button class="btn btn-primary btn-sm" @click="clearSearch">نمایش همه</button>
          <button class="btn btn-ghost btn-sm" @click="suggestLooseSearch">جستجوی آزادتر</button>
        </div>
      </div>
    </div>

    <!-- Results -->
    <!-- اگر ProductGrid prop های highlight رو نداره، :highlight="query" رو حذف کن -->
    <ProductGrid v-else :products="results" :highlight="query" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import ProductGrid from '@/components/ProductGrid.vue'

type SortMode = 'relevance' | 'newest' | 'price_asc' | 'price_desc'

const route = useRoute()
const router = useRouter()
const store = useProductsStore()

onMounted(() => {
  store.load()
})

/** query from route */
const query = computed(() => String(route.query.q || '').trim())

/** local input + debounce -> sync to route */
const localQ = ref(query.value)

watch(query, (v) => {
  if (v !== localQ.value) localQ.value = v
})

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

/** ---- Search helpers (Persian-friendly) ---- */
function normalizeFa(input: string) {
  return input
      .toLowerCase()
      .replace(/\u200c/g, ' ')          // نیم‌فاصله
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
  return tokens.every(tok => haystack.includes(tok))
}

/**
 * امتیازدهی ساده برای relevance:
 * - match در title وزن بیشتر
 * - match در tags/brand/category وزن کمتر
 */
function scoreProduct(p: any, tokens: string[]) {
  const title = normalizeFa(p.title || '')
  const cat = normalizeFa(p.category?.title || p.category || '')
  const brand = normalizeFa(p.brand || '')
  const tags = normalizeFa(Array.isArray(p.tags) ? p.tags.join(' ') : (p.tags || ''))
  const desc = normalizeFa(p.description || '')

  let score = 0
  for (const tok of tokens) {
    if (title.includes(tok)) score += 5
    if (brand.includes(tok)) score += 3
    if (cat.includes(tok)) score += 2
    if (tags.includes(tok)) score += 2
    if (desc.includes(tok)) score += 1
  }

  const qn = normalizeFa(query.value)
  if (qn && title.startsWith(qn)) score += 5

  return score
}

const results = computed(() => {
  const all = store.products || []
  const tokens = tokenize(query.value)

  if (!tokens.length) {
    return applySort(all.slice(), [])
  }

  const filtered = all.filter((p: any) => {
    const hay = normalizeFa(
        [
          p.title,
          p.brand,
          p.category?.title ?? p.category,
          Array.isArray(p.tags) ? p.tags.join(' ') : p.tags,
          p.description,
        ]
            .filter(Boolean)
            .join(' ')
    )

    return includesAllTokens(hay, tokens)
  })

  return applySort(filtered, tokens)
})

function applySort(list: any[], tokens: string[]) {
  switch (sort.value) {
    case 'newest':
      return list.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      )
    case 'price_asc':
      return list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
    case 'price_desc':
      return list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
    case 'relevance':
    default:
      if (!tokens.length) return list
      return list
          .map(p => ({ p, s: scoreProduct(p, tokens) }))
          .sort((a, b) => b.s - a.s)
          .map(x => x.p)
  }
}

watch([sort, query], () => {
  // اگر pagination داشتی اینجا page=1
})

function clearSearch() {
  localQ.value = ''
  const nextQuery = { ...route.query }
  delete nextQuery.q
  router.replace({ query: nextQuery })
}

function suggestLooseSearch() {
  // نسخه فعلی: اگر چند کلمه بود فقط اولین کلمه رو نگه می‌داره
  const tokens = tokenize(localQ.value)
  if (tokens.length > 1) localQ.value = tokens[0]
}
</script>

<style scoped>
/* (اختیاری) اگر خواستی ورودی حتی گردتر شه ولی DaisyUI override نشه */
</style>
