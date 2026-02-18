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

      <div v-if="errorMsg" class="alert alert-error">
        {{ errorMsg }}
      </div>

      <div v-if="!product" class="grid gap-5 lg:grid-cols-12">
        <div class="lg:col-span-7 skeleton h-[420px] rounded-3xl"></div>
        <div class="lg:col-span-5 skeleton h-[420px] rounded-3xl"></div>
      </div>

      <div v-else class="grid gap-5 lg:grid-cols-12">
        <!-- LEFT -->
        <section class="lg:col-span-7 space-y-4">
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

              <div class="absolute top-4 right-4 flex flex-wrap gap-2">
                <span v-if="product.isDigital" class="badge badge-outline bg-base-100/70 backdrop-blur">محصول دیجیتال</span>
                <span v-if="selectedOffer?.instant" class="badge badge-outline bg-base-100/70 backdrop-blur">فوری</span>
                <span v-if="selectedOffer?.region" class="badge badge-outline bg-base-100/70 backdrop-blur">
                  ریجن: {{ selectedOffer.region }}
                </span>
              </div>
            </div>

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

            <div v-if="product?.planChips?.length" class="mt-4 flex flex-wrap gap-2">
              <span v-for="c in product.planChips" :key="c" class="badge badge-ghost">{{ c }}</span>
            </div>

            <div v-if="product.tags?.length" class="mt-4 flex flex-wrap gap-2">
              <span v-for="t in product.tags" :key="t" class="badge badge-ghost">{{ t }}</span>
            </div>

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

        <!-- RIGHT -->
        <aside class="lg:col-span-5">
          <div class="sticky top-5 space-y-4">
            <div class="rounded-3xl border border-base-300/70 bg-base-100/80 shadow-sm p-4 sm:p-5">
              <p class="text-xs text-base-content/55">خلاصه خرید</p>

              <p class="mt-2 font-black leading-8 line-clamp-2">
                {{ selectedTitle }}
              </p>

              <div class="mt-4 rounded-2xl border border-base-300/60 bg-base-100/60 p-4">
                <p class="text-sm font-black mb-3">انتخاب پلن</p>

                <div class="grid gap-3">
                  <label class="form-control">
                    <div class="label py-0 mb-1">
                      <span class="label-text text-xs text-base-content/60">نوع اشتراک</span>
                    </div>

                    <!-- ✅ placeholder اضافه شد -->
                    <select v-model="selectedPlanType" class="select select-bordered w-full bg-base-100/60">
                      <option disabled value="">انتخاب نوع اشتراک</option>
                      <option v-for="t in planTypes" :key="t.id" :value="t.slug">
                        {{ t.title }}
                      </option>
                    </select>
                  </label>

                  <label class="form-control">
                    <div class="label py-0 mb-1">
                      <span class="label-text text-xs text-base-content/60">مدت زمان اشتراک</span>
                    </div>

                    <!-- ✅ placeholder اضافه شد -->
                    <select v-model="selectedPlanDuration" class="select select-bordered w-full bg-base-100/60">
                      <option disabled value="">انتخاب مدت زمان</option>
                      <option v-for="d in planDurations" :key="d.id" :value="d.slug">
                        {{ d.title }}
                      </option>
                    </select>
                  </label>

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

              <div class="mt-5 grid gap-3">
                <button class="btn btn-primary w-full" :disabled="loading || !selectedOffer" @click="handleAddToCart">
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
          <button class="btn btn-primary" :disabled="loading || !selectedOffer" @click="handleAddToCart">خرید</button>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import PriceTag from '@/components/PriceTag.vue'
import RatingStars from '@/components/RatingStars.vue'
import QuantityInput from '@/components/QuantityInput.vue'

import { getProduct } from '@/services/products'
import { addCartItem, getCart } from '@/services/cart'

import type { GetProductResponse, ProductDto } from '@/types/api_client_types/products.dto.ts'
import type { AddCartItemPayload } from '@/types/api_client_types/cart.dto.ts'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const auth = useAuthStore()

const qty = ref(1)
const product = ref<ProductVM | null>(null)
const loading = ref(false)
const errorMsg = ref<string | null>(null)
const tab = ref<'desc' | 'reviews'>('desc')
const detailsRef = ref<HTMLElement | null>(null)
const productId = computed(() => Number(route.params.id) || null)
const personalActivation = ref(false)

// برای هدایت بعد از لاگین
const pendingAddToCartPayload = ref<AddCartItemPayload | null>(null)

/* -----------------------------
   Types
----------------------------- */
type ProductVM = {
  id: number
  title: string
  description: string
  image?: string
  images?: string[]
  planTypeOptions?: OptionVM[]
  planDurationOptions?: OptionVM[]
  offers?: OfferVM[]
  planChips?: string[]
  tags?: string[]
  rating?: number
  reviewCount?: number
  reviews?: { name?: string; text?: string; comment?: string; date?: string; rating?: number }[]
  price?: number | null
  basePrice?: number | null
  compareAt?: number | null
  isDigital?: boolean
  personalActivationSupported?: boolean
  slug?: string
}

type OptionVM = { id: number; slug: string; title: string }

type OfferVM = {
  id: number
  title: string

  typeId?: number
  typeSlug?: string
  typeTitle?: string

  durationId?: number
  durationSlug?: string
  durationTitle?: string

  price?: number | null
  compareAt?: number | null

  instant?: boolean
  region?: string
  deliveryTime?: string
  support?: string
  warranty?: string
  deliveryMethod?: string
  personalActivationSupported?: boolean
}

/* -----------------------------
   Computeds
----------------------------- */
const normalizedOptions = computed(() => product.value?.offers ?? [])
const selectedPlanType = ref<string>('')
const selectedPlanDuration = ref<string>('')

const planTypes = computed<OptionVM[]>(() => product.value?.planTypeOptions ?? [])
const planDurations = computed<OptionVM[]>(() => product.value?.planDurationOptions ?? [])

const selectedOffer = computed<OfferVM | null>(() => {
  const opts = normalizedOptions.value
  if (!opts.length) return null

  const found =
      opts.find(o => {
        const typeOk = selectedPlanType.value ? o.typeSlug === selectedPlanType.value : true
        const durOk = selectedPlanDuration.value ? o.durationSlug === selectedPlanDuration.value : true
        return typeOk && durOk
      }) || null

  return found || opts[0] || null
})

const selectedTitle = computed(() => (selectedOffer.value?.title || product.value?.title || '').trim())
const selectedSubline = computed(() => {
  const o = selectedOffer.value
  const bits = [o?.typeTitle, o?.durationTitle].filter(Boolean)
  return bits.length ? bits.join(' • ') : ''
})

const personalActivationSupported = computed(() => {
  return selectedOffer.value?.personalActivationSupported ?? !!product.value?.personalActivationSupported
})
watch(personalActivationSupported, (ok) => {
  if (!ok) personalActivation.value = false
})

const displayPrice = computed(() => selectedOffer.value?.price ?? product.value?.price ?? 0)
const displayCompareAt = computed(() => selectedOffer.value?.compareAt ?? product.value?.compareAt ?? 0)

const galleryImages = computed(() => {
  const imgs = product.value?.images?.filter(Boolean)
  if (imgs?.length) return imgs
  return [product.value?.image || 'https://placehold.co/1200x700']
})

const activeImage = ref<string>('')
const zoomRef = ref<HTMLDialogElement | null>(null)

function openZoom() { zoomRef.value?.showModal?.() }
function closeZoom() { zoomRef.value?.close?.() }

watch(galleryImages, (imgs) => {
  if (!imgs.includes(activeImage.value)) activeImage.value = imgs[0]
})

watch(product, (p) => {
  if (!p) return
  // ✅ اگر گزینه‌ها هست، پیش‌فرض را ست کن
  selectedPlanType.value = p.planTypeOptions?.[0]?.slug ?? ''
  selectedPlanDuration.value = p.planDurationOptions?.[0]?.slug ?? ''
})

/* -----------------------------
   Helpers
----------------------------- */
function priceKey(stId: number, dtId: number) {
  return `${stId}:${dtId}`
}

/**
 * normalize محصول:
 * - dropdown ها از subscription_types / duration_types
 * - قیمت ترکیبی از dto.prices
 * - fallback از legacy
 */
function normalizeProduct(dto: ProductDto): ProductVM {
  const mainImage = dto.image_url ?? 'https://placehold.co/1200x700'
  const gallery = [mainImage]

  let planTypeOptions: OptionVM[] =
      (dto.subscription_types?.map(t => ({ id: t.id, slug: t.slug, title: t.title })) ?? [])

  let planDurationOptions: OptionVM[] =
      (dto.duration_types?.map(d => ({ id: d.id, slug: d.slug, title: d.title })) ?? [])

  const basePrice = (dto as any).base_price ?? dto.price ?? null
  const compareAt = dto.compare_at_price ?? null

  // price map from dto.prices
  const priceRows = ((dto as any).prices ?? []) as Array<{ subscription_type_id: number; duration_type_id: number; price: number }>
  const priceMap = new Map<string, number>()
  for (const row of priceRows) {
    if (row?.subscription_type_id && row?.duration_type_id && row?.price != null) {
      priceMap.set(priceKey(row.subscription_type_id, row.duration_type_id), row.price)
    }
  }

  // fallback options from prices if arrays empty
  if ((!planTypeOptions.length || !planDurationOptions.length) && priceRows.length) {
    const stIds = new Set<number>()
    const dtIds = new Set<number>()
    for (const row of priceRows) {
      stIds.add(row.subscription_type_id)
      dtIds.add(row.duration_type_id)
    }

    if (!planTypeOptions.length) {
      planTypeOptions = Array.from(stIds).map(id => ({
        id,
        slug: id === 2 ? 'individual' : id === 1 ? 'family' : String(id),
        title: id === 2 ? 'شخصی' : id === 1 ? 'خانوادگی' : `پلن ${id}`,
      }))
    }

    if (!planDurationOptions.length) {
      planDurationOptions = Array.from(dtIds).map(id => ({
        id,
        slug: id === 1 ? '1_month' : id === 2 ? '3_month' : id === 3 ? '6_month' : id === 4 ? '1_year' : String(id),
        title: id === 1 ? '1 ماهه' : id === 2 ? '3 ماهه' : id === 3 ? '6 ماهه' : id === 4 ? '1 ساله' : `مدت ${id}`,
      }))
    }
  }

  // legacy fallback
  if (!planTypeOptions.length && (dto as any).subscription_type_id) {
    const id = (dto as any).subscription_type_id as number
    planTypeOptions = [{
      id,
      slug: id === 2 ? 'individual' : id === 1 ? 'family' : String(id),
      title: id === 2 ? 'شخصی' : id === 1 ? 'خانوادگی' : `پلن ${id}`,
    }]
  }

  if (!planDurationOptions.length && (dto as any).duration_type_id) {
    const id = (dto as any).duration_type_id as number
    planDurationOptions = [{
      id,
      slug: id === 1 ? '1_month' : id === 2 ? '3_month' : id === 3 ? '6_month' : id === 4 ? '1_year' : String(id),
      title: id === 1 ? '1 ماهه' : id === 2 ? '3 ماهه' : id === 3 ? '6 ماهه' : id === 4 ? '1 ساله' : `مدت ${id}`,
    }]
  }

  // build offers
  const offers: OfferVM[] = []
  if (planTypeOptions.length && planDurationOptions.length) {
    for (const t of planTypeOptions) {
      for (const d of planDurationOptions) {
        const p = priceMap.get(priceKey(t.id, d.id))
        offers.push({
          id: Number(`${dto.id}${t.id}${d.id}`),
          title: `${dto.title} • ${t.title} • ${d.title}`,
          typeId: t.id,
          typeSlug: t.slug,
          typeTitle: t.title,
          durationId: d.id,
          durationSlug: d.slug,
          durationTitle: d.title,
          price: p ?? basePrice,
          compareAt,
          personalActivationSupported: dto.personal_account ?? false,
        })
      }
    }
  } else {
    offers.push({
      id: dto.id,
      title: dto.title,
      price: basePrice,
      compareAt,
      personalActivationSupported: dto.personal_account ?? false,
    })
  }

  const planChips = [...planTypeOptions.map(p => p.title), ...planDurationOptions.map(d => d.title)]

  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? '',
    slug: dto.slug ?? undefined,
    image: mainImage,
    images: gallery,
    planTypeOptions,
    planDurationOptions,
    offers,
    planChips,
    tags: [],
    rating: 4.5,
    reviewCount: 24,
    reviews: [],
    price: basePrice,
    basePrice,
    compareAt,
    isDigital: true,
    personalActivationSupported: dto.personal_account ?? false,
  }
}

/* -----------------------------
   Load product
----------------------------- */
async function loadProduct() {
  const id = productId.value
  if (!id) {
    product.value = null
    errorMsg.value = 'شناسه محصول در آدرس وجود ندارد یا معتبر نیست.'
    return
  }

  loading.value = true
  errorMsg.value = null
  product.value = null

  try {
    const dto: GetProductResponse = await getProduct(id)
    product.value = normalizeProduct(dto as any)
    activeImage.value = galleryImages.value[0]
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

function scrollToDetails() {
  detailsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* -----------------------------
   Cart ops
----------------------------- */
async function refreshCart() {
  try {
    const fresh = await getCart()
    cart.setCart(fresh)
  } catch (e) {
    console.error('refresh cart error:', e)
  }
}

async function handleAddToCart() {
  if (!product.value || !selectedOffer.value) return

  // ✅ همیشه از offer.id ها استفاده کن (نه جستجو با slug)
  const payload: AddCartItemPayload = {
    product_id: product.value.id,
    quantity: qty.value,
    subscription_type_id: selectedOffer.value.typeId ?? undefined,
    duration_type_id: selectedOffer.value.durationId ?? undefined,
    personal_account: personalActivation.value || undefined,
  }

  if (!auth.isAuthenticated) {
    pendingAddToCartPayload.value = payload
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  loading.value = true
  try {
    await addCartItem(payload)
    await refreshCart()
  } catch (err) {
    console.error('add to cart error:', err)
  } finally {
    loading.value = false
  }
}

// ✅ پس از لاگین: payload معلق را اجرا کن و بعد cart را sync کن
watch(
    () => auth.isAuthenticated,
    (ok) => {
      if (!ok) return
      const payload = pendingAddToCartPayload.value
      if (!payload) return

      pendingAddToCartPayload.value = null

      ;(async () => {
        loading.value = true
        try {
          await addCartItem(payload)
          await refreshCart()
        } catch (err) {
          console.error('add to cart error:', err)
        } finally {
          loading.value = false
        }
      })()
    }
)
</script>


<style scoped>
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { scrollbar-width: none; }
</style>
