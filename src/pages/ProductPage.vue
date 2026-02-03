<template>
  <div class="min-h-screen bg-base-200/70" dir="rtl">
    <!-- backdrop -->
    <div class="pointer-events-none fixed inset-0 -z-10 opacity-70">
      <div class="absolute -top-24 right-0 h-80 w-80 rounded-full bg-primary/20 blur-3xl"></div>
      <div class="absolute top-24 left-0 h-72 w-72 rounded-full bg-secondary/15 blur-3xl"></div>
      <div class="absolute -bottom-24 left-1/3 h-96 w-96 rounded-full bg-accent/10 blur-3xl"></div>
    </div>

    <main class="mx-auto max-w-6xl px-4 lg:px-0 py-6 space-y-5">
      <Breadcrumbs
          class="mt-2"
          :crumbs="[
          { title: 'محصولات', to: '/category/accounts' },
          { title: product?.title || '...' }
        ]"
      />

      <!-- optional: error -->
      <div v-if="errorMsg" class="alert alert-error">
        {{ errorMsg }}
      </div>

      <!-- skeleton -->
      <div v-if="!product" class="grid gap-5 lg:grid-cols-12">
        <div class="lg:col-span-7 skeleton h-[420px] rounded-3xl"></div>
        <div class="lg:col-span-5 skeleton h-[420px] rounded-3xl"></div>
      </div>

      <!-- content -->
      <div v-else class="grid gap-5 lg:grid-cols-12">
        <!-- LEFT: Gallery + Content -->
        <section class="lg:col-span-7 space-y-4">
          <!-- Gallery card -->
          <div class="rounded-3xl border border-base-300/70 bg-base-100/80 shadow-sm overflow-hidden">
            <div class="relative">
              <img
                  :src="activeImage"
                  :alt="product.title"
                  class="w-full h-[320px] sm:h-[420px] object-cover"
                  loading="lazy"
                  @click="openZoom"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent"></div>

              <!-- chips -->
              <div class="absolute top-4 right-4 flex flex-wrap gap-2">
                <span v-if="product.isDigital" class="badge badge-outline bg-base-100/70 backdrop-blur">محصول دیجیتال</span>
                <span v-if="selectedOffer?.instant" class="badge badge-outline bg-base-100/70 backdrop-blur">فوری</span>
                <span v-if="selectedOffer?.region" class="badge badge-outline bg-base-100/70 backdrop-blur">
                  ریجن: {{ selectedOffer.region }}
                </span>
                <span v-if="selectedOffer?._duration" class="badge badge-outline bg-base-100/70 backdrop-blur">
                  مدت: {{ selectedOffer._duration }}
                </span>
              </div>
            </div>

            <!-- thumbs -->
            <div v-if="galleryImages.length > 1" class="p-3 sm:p-4">
              <div class="flex gap-2 overflow-x-auto scrollbar-none py-1">
                <button
                    v-for="(img, i) in galleryImages"
                    :key="img + i"
                    type="button"
                    class="group relative flex-none w-[84px] h-[58px] rounded-2xl overflow-hidden border transition"
                    :class="img === activeImage ? 'border-primary/60 ring-2 ring-primary/20' : 'border-base-300/70 hover:border-primary/40'"
                    @click="activeImage = img"
                    :aria-label="`تصویر ${i + 1}`"
                >
                  <img :src="img" :alt="product.title" class="w-full h-full object-cover group-hover:scale-105 transition" />
                </button>
              </div>
            </div>
          </div>

          <!-- Title + trust row + Tabs -->
          <div class="rounded-3xl border border-base-300/70 bg-base-100/70 shadow-sm p-4 sm:p-5">
            <h1 class="text-xl sm:text-2xl font-black leading-9">
              {{ product.title }}
            </h1>

            <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <RatingStars :value="product.rating || 4.5" />
                <span class="text-xs text-base-content/50">({{ product.reviewCount ?? 24 }} نظر)</span>
              </div>

              <div class="mt-4">
                <PriceTag :price="displayPrice" :compareAt="displayCompareAt" />
              </div>
            </div>

            <!-- trust strip -->
            <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="rounded-2xl border border-base-300/60 bg-base-100/60 p-3">
                <p class="text-[11px] text-base-content/60">تحویل</p>
                <p class="font-extrabold text-sm mt-1">{{ selectedOffer?.deliveryTime || 'کمتر از 4 ساعت' }}</p>
              </div>
              <div class="rounded-2xl border border-base-300/60 bg-base-100/60 p-3">
                <p class="text-[11px] text-base-content/60">پشتیبانی</p>
                <p class="font-extrabold text-sm mt-1">{{ selectedOffer?.support || 'فعال' }}</p>
              </div>
              <div class="rounded-2xl border border-base-300/60 bg-base-100/60 p-3">
                <p class="text-[11px] text-base-content/60">گارانتی</p>
                <p class="font-extrabold text-sm mt-1">{{ selectedOffer?.warranty || 'طبق پلن' }}</p>
              </div>
              <div class="rounded-2xl border border-base-300/60 bg-base-100/60 p-3">
                <p class="text-[11px] text-base-content/60">روش تحویل</p>
                <p class="font-extrabold text-sm mt-1">{{ selectedOffer?.deliveryMethod || 'پنل / ایمیل' }}</p>
              </div>
            </div>

            <div v-if="product.tags?.length" class="mt-4 flex flex-wrap gap-2">
              <span v-for="t in product.tags" :key="t" class="badge badge-ghost">{{ t }}</span>
            </div>

            <!-- Tabs container -->
            <div ref="detailsRef" class="mt-5 border-t border-base-300/60 pt-4">
              <div class="tabs tabs-boxed bg-base-100/60 p-1 rounded-2xl">
                <button class="tab flex-1" :class="tab === 'desc' ? 'tab-active' : ''" @click="tab='desc'">
                  توضیحات
                </button>
                <button class="tab flex-1" :class="tab === 'reviews' ? 'tab-active' : ''" @click="tab='reviews'">
                  نظرات
                </button>
              </div>

              <div v-if="tab === 'desc'" class="mt-4">
                <p class="text-sm text-base-content/70 leading-7">
                  {{ product.description }}
                </p>
              </div>

              <div v-else class="mt-4">
                <div v-if="product.reviews?.length" class="space-y-3">
                  <div
                      v-for="(r, i) in product.reviews"
                      :key="i"
                      class="rounded-2xl border border-base-300/60 bg-base-100/60 p-4"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="font-extrabold truncate">{{ r.name || 'کاربر' }}</p>
                        <p v-if="r.date" class="text-xs text-base-content/50 mt-1">{{ r.date }}</p>
                      </div>
                      <div class="flex-none">
                        <RatingStars :value="r.rating || 5" />
                      </div>
                    </div>
                    <p class="mt-3 text-sm text-base-content/70 leading-7">
                      {{ r.text || r.comment }}
                    </p>
                  </div>
                </div>

                <div v-else class="text-sm text-base-content/60 py-6 text-center">
                  نظری برای نمایش وجود ندارد.
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- RIGHT: Buy box -->
        <aside class="lg:col-span-5">
          <div class="sticky top-5 space-y-4">
            <div class="rounded-3xl border border-base-300/70 bg-base-100/80 shadow-sm p-4 sm:p-5">
              <p class="text-xs text-base-content/55">خلاصه خرید</p>

              <p class="mt-2 font-black leading-8 line-clamp-2">
                {{ selectedTitle }}
              </p>

              <!-- انتخاب پلن -->
              <div class="mt-4 rounded-2xl border border-base-300/60 bg-base-100/60 p-4">
                <p class="text-sm font-black mb-3">انتخاب پلن</p>

                <div class="grid gap-3">
                  <label class="form-control">
                    <div class="label py-0 mb-1">
                      <span class="label-text text-xs text-base-content/60">نوع اشتراک</span>
                    </div>
                    <select
                        v-model="selectedPlanType"
                        class="select select-bordered w-full bg-base-100/60"
                        :disabled="planTypes.length <= 1"
                    >
                      <option v-for="t in planTypes" :key="t" :value="t">{{ t }}</option>
                    </select>
                  </label>

                  <label class="form-control">
                    <div class="label py-0 mb-1">
                      <span class="label-text text-xs text-base-content/60">مدت زمان پلن</span>
                    </div>
                    <select
                        v-model="selectedPlanDuration"
                        class="select select-bordered w-full bg-base-100/60"
                        :disabled="planDurations.length <= 1"
                    >
                      <option v-for="d in planDurations" :key="d" :value="d">{{ d }}</option>
                    </select>
                  </label>

                  <!-- ✅ فعال‌سازی برای اکانت شخصی -->
                  <label class="flex items-start gap-2 text-xs pt-1">
                    <input
                        v-model="personalActivation"
                        type="checkbox"
                        class="checkbox checkbox-sm mt-0.5"
                        :disabled="!personalActivationSupported"
                    />
                    <span class="flex items-center gap-2">
                      <span>فعال‌سازی برای اکانت شخصی</span>
                      <span v-if="!personalActivationSupported" class="badge badge-ghost">در این پلن موجود نیست</span>
                    </span>
                  </label>

                  <!-- اگر با انتخاب پلن، هیچ آیتمی پیدا نشود -->
                  <div v-if="product && normalizedOptions.length && !selectedOffer" class="alert alert-warning text-xs">
                    پلن انتخاب‌شده موجود نیست. لطفاً نوع/مدت را تغییر دهید.
                  </div>
                </div>
              </div>

              <div class="mt-4 flex items-center justify-between gap-3">
                <PriceTag :price="displayPrice" :compareAt="displayCompareAt" />
                <div class="shrink-0 flex justify-start">
                  <QuantityInput v-model="qty" />
                </div>
              </div>

              <div class="mt-4 flex flex-wrap gap-2">
                <span v-if="selectedOffer?.region" class="badge badge-ghost">ریجن: {{ selectedOffer.region }}</span>
                <span v-if="selectedOffer?._duration" class="badge badge-ghost">مدت: {{ selectedOffer._duration }}</span>
                <span v-if="selectedOffer?.instant" class="badge badge-success badge-outline">فوری</span>
              </div>

              <div class="mt-5 grid gap-3">
                <button class="btn btn-primary w-full" :disabled="loading || !selectedOffer" @click="add">
                  افزودن به سبد
                </button>
                <button class="btn btn-ghost w-full" @click="scrollToDetails">جزئیات محصول</button>
              </div>

              <div class="mt-5 rounded-2xl border border-base-300/60 bg-base-100/60 p-4 text-sm text-base-content/70">
                <div class="flex items-center justify-between">
                  <span>تحویل</span>
                  <b class="text-base-content">{{ selectedOffer?.deliveryTime || 'فوری' }}</b>
                </div>
                <div class="mt-2 flex items-center justify-between">
                  <span>راهنما</span>
                  <b class="text-base-content">مرحله‌به‌مرحله</b>
                </div>
              </div>

            </div>
          </div>
        </aside>
      </div>

      <!-- Mobile bottom bar -->
      <div v-if="product" class="lg:hidden sticky bottom-0 z-30 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <div class="rounded-3xl border border-base-300/70 bg-base-100/90 backdrop-blur shadow-lg px-3 py-3 flex items-center gap-3">
          <div class="min-w-0 flex-1">
            <p class="text-[11px] text-base-content/55 line-clamp-1">
              پلن: {{ selectedTitle }}
              <span v-if="selectedSubline"> • {{ selectedSubline }}</span>
            </p>
            <div class="mt-1">
              <PriceTag :price="displayPrice" :compareAt="displayCompareAt" />
            </div>
          </div>
          <button class="btn btn-primary" :disabled="loading || !selectedOffer" @click="add">خرید</button>
          <button class="btn btn-ghost" @click="scrollToDetails">جزئیات</button>
        </div>
      </div>
    </main>

    <!-- Zoom modal -->
    <dialog ref="zoomRef" class="modal">
      <div class="modal-box w-11/12 max-w-4xl p-0 overflow-hidden">
        <div class="relative">
          <img :src="activeImage" :alt="product?.title" class="w-full max-h-[80vh] object-contain bg-black" />
          <button class="btn btn-sm btn-circle absolute top-3 left-3" @click="closeZoom">✕</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button aria-label="close">close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import PriceTag from '@/components/PriceTag.vue'
import RatingStars from '@/components/RatingStars.vue'
import QuantityInput from '@/components/QuantityInput.vue'
import { getProduct } from '@/services/products'

/**
 * نکته:
 * چون گفتی تایپ‌های api client برای getProduct عوض شده،
 * این صفحه را طوری نوشتم که با چند ساختار رایج جواب بدهد:
 * - dto.data / dto.product / dto.data.product
 * - buy_items / buyItems / offers / plans / variants / options
 * - price به شکل number یا string یا object (amount/value)
 *
 * اگر تایپ دقیق جنریت‌شده‌ات را اینجا ایمپورت کنی، فقط نوع DTO را جایگزین کن.
 */

type ReviewVM = { name?: string; date?: string; rating?: number; text?: string; comment?: string }

type OfferVM = {
  id: number | string
  title?: string
  price?: number
  compareAt?: number

  // meta / delivery
  region?: string
  instant?: boolean
  deliveryTime?: string
  support?: string
  warranty?: string
  deliveryMethod?: string

  // plan selection
  _type: string
  _duration: string

  // personal activation
  personalActivationSupported?: boolean
  personalActivationPrice?: number
  personalActivationCompareAt?: number

  // raw passthrough
  [k: string]: any
}

type ProductVM = {
  id: number | string
  title: string
  description: string
  slug?: string
  price?: number
  compareAt?: number
  image: string
  images: string[]
  isDigital?: boolean
  rating?: number
  reviewCount?: number
  reviews?: ReviewVM[]
  tags?: string[]
  offers: OfferVM[]
  personalActivationSupported?: boolean
}

const route = useRoute()
const cart = useCartStore()

const qty = ref(1)
const product = ref<ProductVM | null>(null)
const loading = ref(false)
const errorMsg = ref<string | null>(null)

const tab = ref<'desc' | 'reviews'>('desc')
const detailsRef = ref<HTMLElement | null>(null)

/** ✅ ID فقط از Route */
const productId = computed(() => {
  const n = Number(route.params.id)
  return Number.isFinite(n) ? n : null
})

/** ✅ گزینه فعالسازی اکانت شخصی */
const personalActivation = ref(false)

/** ---------- helpers ---------- */
function normalizeImageUrl(u?: string | null) {
  const s = (u ?? '').trim()
  if (!s) return ''
  if (/^https?:\/\//i.test(s)) return s
  if (s.startsWith('/')) return s
  return ''
}

function asNumber(v: any): number | undefined {
  if (v == null) return undefined
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const n = Number(v.replaceAll(',', '').trim())
    return Number.isFinite(n) ? n : undefined
  }
  // price object: { amount, value, price }
  if (typeof v === 'object') {
    const cand = v.amount ?? v.value ?? v.price ?? v.final ?? v.total
    return asNumber(cand)
  }
  return undefined
}

function pick<T = any>(obj: any, keys: string[]): T | undefined {
  for (const k of keys) {
    if (obj?.[k] != null) return obj[k]
  }
  return undefined
}

function getPlanTypeLabel(o: any) {
  return (
      pick(o, ['subscription_type', 'subscriptionType', 'plan_type', 'planType', 'type', 'kind', 'tier', 'package']) ||
      'استاندارد'
  )
}
function getDurationLabel(o: any) {
  const d =
      pick(o, ['duration', 'period', 'term', 'months', 'days', 'length', 'time', 'plan_duration', 'planDuration']) || ''
  return String(d ?? '').trim()
}

function normalizeOffers(raw: any): OfferVM[] {
  // ساختارهای مختلفی که ممکنه از API بیاد
  const list =
      (Array.isArray(raw?.buy_items) && raw.buy_items) ||
      (Array.isArray(raw?.buyItems) && raw.buyItems) ||
      (Array.isArray(raw?.offers) && raw.offers) ||
      (Array.isArray(raw?.plans) && raw.plans) ||
      (Array.isArray(raw?.variants) && raw.variants) ||
      (Array.isArray(raw?.options) && raw.options) ||
      []

  return (list as any[]).map((o: any, idx: number) => {
    const price = asNumber(pick(o, ['price', 'amount', 'final_price', 'finalPrice', 'unit_price', 'unitPrice']))
    const compareAt = asNumber(pick(o, ['compare_at_price', 'compareAt', 'compare_at', 'compareAtPrice']))

    // پشتیبانی از personal activation (چند نام ممکن)
    const paSupported =
        Boolean(
            pick(o, [
              'personal_activation_supported',
              'personalActivationSupported',
              'allow_personal_activation',
              'allowPersonalActivation'
            ])
        ) || false

    const paPrice = asNumber(pick(o, ['personal_activation_price', 'personalActivationPrice', 'price_personal']))
    const paCompareAt = asNumber(pick(o, ['personal_activation_compare_at', 'personalActivationCompareAt']))

    return {
      ...o,
      id: o?.id ?? idx,
      title: o?.title ?? o?.name ?? raw?.title ?? 'پلن',
      price,
      compareAt,

      region: pick(o, ['region', 'region_name', 'regionName']),
      instant: Boolean(pick(o, ['instant', 'is_instant', 'isInstant'])),
      deliveryTime: pick(o, ['delivery_time', 'deliveryTime', 'delivery_eta', 'eta']),
      support: pick(o, ['support', 'support_status', 'supportStatus']),
      warranty: pick(o, ['warranty', 'guarantee']),
      deliveryMethod: pick(o, ['delivery_method', 'deliveryMethod', 'method']),

      _type: String(getPlanTypeLabel(o) || 'استاندارد'),
      _duration: String(getDurationLabel(o) || '').trim(),

      personalActivationSupported: paSupported,
      personalActivationPrice: paPrice,
      personalActivationCompareAt: paCompareAt
    }
  })
}

function normalizeProduct(dto: any): ProductVM {
  // dto ممکنه data داشته باشه یا مستقیم محصول باشه
  const raw = dto?.data?.product ?? dto?.product ?? dto?.data ?? dto

  const main = normalizeImageUrl(raw?.image_url || raw?.image)
  const gallery =
      Array.isArray(raw?.images)
          ? raw.images.map((x: any) => normalizeImageUrl(String(x))).filter(Boolean)
          : Array.isArray(raw?.gallery)
              ? raw.gallery.map((x: any) => normalizeImageUrl(String(x))).filter(Boolean)
              : main
                  ? [main]
                  : []

  const offers = normalizeOffers(raw)

  const productPersonalActivationSupported =
      Boolean(
          pick(raw, [
            'personal_activation_supported',
            'personalActivationSupported',
            'allow_personal_activation',
            'allowPersonalActivation'
          ])
      ) || offers.some(o => o.personalActivationSupported)

  return {
    id: raw?.id,
    title: raw?.title ?? 'بدون عنوان',
    description: raw?.description ?? '',
    slug: raw?.slug,

    price: asNumber(raw?.price) ?? undefined,
    compareAt: asNumber(raw?.compare_at_price ?? raw?.compareAt ?? raw?.compare_at) ?? undefined,

    image: gallery[0] || 'https://placehold.co/1200x700',
    images: gallery.length ? gallery : ['https://placehold.co/1200x700'],

    isDigital: raw?.is_digital ?? raw?.isDigital ?? true,
    rating: raw?.rating,
    reviewCount: raw?.reviewCount ?? raw?.review_count,
    reviews: raw?.reviews,
    tags: raw?.tags,

    offers,
    personalActivationSupported: productPersonalActivationSupported
  }
}

/** ---------- options (based on API response) ---------- */
const normalizedOptions = computed<OfferVM[]>(() => {
  return product.value?.offers ?? []
})

const selectedPlanType = ref<string>('')
const selectedPlanDuration = ref<string>('')

const planTypes = computed(() => {
  const set = new Set(normalizedOptions.value.map(o => o._type).filter(Boolean))
  return Array.from(set)
})

const planDurations = computed(() => {
  const pool = selectedPlanType.value
      ? normalizedOptions.value.filter(o => o._type === selectedPlanType.value)
      : normalizedOptions.value
  const set = new Set(pool.map(o => o._duration).filter(Boolean))
  return Array.from(set)
})

const selectedOffer = computed<OfferVM | null>(() => {
  const opts = normalizedOptions.value
  if (!opts.length) return null

  const found =
      opts.find(o => {
        const typeOk = selectedPlanType.value ? o._type === selectedPlanType.value : true
        const durOk = selectedPlanDuration.value ? o._duration === selectedPlanDuration.value : true
        return typeOk && durOk
      }) || null

  return found || opts[0] || null
})

const selectedTitle = computed(() => (selectedOffer.value?.title || product.value?.title || '').trim())
const selectedSubline = computed(() => {
  const o: any = selectedOffer.value
  const bits = [o?._type, o?._duration].filter(Boolean)
  return bits.length ? bits.join(' • ') : ''
})

/** personal activation availability per selected offer */
const personalActivationSupported = computed(() => {
  // اگر API این قابلیت را فقط روی محصول داده باشد:
  if (selectedOffer.value?.personalActivationSupported != null) return !!selectedOffer.value.personalActivationSupported
  return !!product.value?.personalActivationSupported
})

watch(personalActivationSupported, (ok) => {
  if (!ok) personalActivation.value = false
})

function getOfferPrice(o: OfferVM | null, personal: boolean) {
  if (!o) return { price: undefined as number | undefined, compareAt: undefined as number | undefined }

  if (personal) {
    const p = o.personalActivationPrice ?? o.price
    const c = o.personalActivationCompareAt ?? o.compareAt
    return { price: p, compareAt: c }
  }

  return { price: o.price ?? product.value?.price, compareAt: o.compareAt ?? product.value?.compareAt }
}

const displayPrice = computed(() => getOfferPrice(selectedOffer.value, personalActivation.value).price)
const displayCompareAt = computed(() => getOfferPrice(selectedOffer.value, personalActivation.value).compareAt)

/** ---------- gallery ---------- */
const galleryImages = computed<string[]>(() => {
  const imgs = product.value?.images
  if (Array.isArray(imgs) && imgs.length) return imgs.filter(Boolean)
  return [product.value?.image || 'https://placehold.co/1200x700']
})

const activeImage = ref<string>('')

const zoomRef = ref<HTMLDialogElement | null>(null)
function openZoom() {
  zoomRef.value?.showModal?.()
}
function closeZoom() {
  zoomRef.value?.close?.()
}

watch(galleryImages, (imgs) => {
  if (!imgs?.length) return
  if (!imgs.includes(activeImage.value)) activeImage.value = imgs[0]
})

watch([planTypes, planDurations], () => {
  // ست کردن پیش‌فرض‌ها از روی پاسخ API
  if (planTypes.value.length && !planTypes.value.includes(selectedPlanType.value)) {
    selectedPlanType.value = planTypes.value[0]
  }

  if (planDurations.value.length) {
    if (!planDurations.value.includes(selectedPlanDuration.value)) {
      selectedPlanDuration.value = planDurations.value[0]
    }
  } else {
    selectedPlanDuration.value = ''
  }
})

/** ✅ load by id (مثل بک‌اند) */
async function loadProduct() {
  const id = productId.value
  console.log('[ProductPage] params:', route.params, 'resolved id:', id)

  if (!id) {
    product.value = null
    errorMsg.value = 'شناسه محصول در آدرس وجود ندارد یا معتبر نیست.'
    return
  }

  loading.value = true
  errorMsg.value = null
  product.value = null

  try {
    const dto = await getProduct(id) // ✅ /products/:id
    const vm = normalizeProduct(dto)
    product.value = vm

    activeImage.value = galleryImages.value[0]

    // پیش‌فرض نوع/مدت
    const first = vm.offers?.[0]
    if (first) {
      selectedPlanType.value = first._type
      selectedPlanDuration.value = first._duration || ''
    }

    // اگر قابلیت personal activation روی محصول/پلن نیست، خاموشش کن
    if (!vm.personalActivationSupported && !first?.personalActivationSupported) {
      personalActivation.value = false
    }
  } catch (e) {
    console.error('load product error:', e)
    errorMsg.value = 'خطا در دریافت اطلاعات محصول'
    product.value = null
  } finally {
    loading.value = false
  }
}

onMounted(loadProduct)
watch(() => route.params.id, loadProduct)

function add() {
  if (!product.value || !selectedOffer.value) return

  const offerId = selectedOffer.value.id

  // متادیتا برای اینکه توی سبد خرید دقیقاً مشخص باشه کاربر چه پلنی انتخاب کرده
  const meta = {
    productId: product.value.id,
    productTitle: product.value.title,
    planType: selectedOffer.value._type,
    planDuration: selectedOffer.value._duration,
    personalActivation: personalActivation.value,
    // اگر خواستی این‌ها رو هم نگه دار:
    region: selectedOffer.value.region,
    price: displayPrice.value
  }

  // اگر cart.add شما پارامتر سوم را پشتیبانی کند، ارسال می‌شود؛ در غیر اینصورت fallback:
  try {
    ;(cart as any).add(offerId as any, qty.value, meta)
  } catch {
    cart.add(offerId as any, qty.value)
  }
}

function scrollToDetails() {
  detailsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { scrollbar-width: none; }
</style>
