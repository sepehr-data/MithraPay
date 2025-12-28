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

      <div v-if="!product" class="grid gap-5 lg:grid-cols-12">
        <div class="lg:col-span-7 skeleton h-[420px] rounded-3xl"></div>
        <div class="lg:col-span-5 skeleton h-[420px] rounded-3xl"></div>
      </div>

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
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent"></div>

              <!-- chips -->
              <div class="absolute top-4 right-4 flex flex-wrap gap-2">
                <span v-if="product.isDigital" class="badge badge-outline bg-base-100/70 backdrop-blur">محصول دیجیتال</span>
                <span v-if="selectedOffer?.instant" class="badge badge-outline bg-base-100/70 backdrop-blur">فوری</span>
                <span v-if="selectedOffer?.region" class="badge badge-outline bg-base-100/70 backdrop-blur">ریجن: {{ selectedOffer.region }}</span>
                <span v-if="selectedOffer?._duration" class="badge badge-outline bg-base-100/70 backdrop-blur">مدت: {{ selectedOffer._duration }}</span>
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

          <!-- Title + trust row + Tabs (چسبیده) -->
          <div class="rounded-3xl border border-base-300/70 bg-base-100/70 shadow-sm p-4 sm:p-5">
            <h1 class="text-xl sm:text-2xl font-black leading-9">
              {{ product.title }}
            </h1>

            <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <RatingStars :value="product.rating || 4.5" />
                <span class="text-xs text-base-content/50">({{ (product.reviewCount ?? 24) }} نظر)</span>
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

            <!-- Tabs container (چسبیده به همین کارت) -->
            <div ref="detailsRef" class="mt-5 border-t border-base-300/60 pt-4">
              <div class="tabs tabs-boxed bg-base-100/60 p-1 rounded-2xl">
                <button class="tab flex-1" :class="tab === 'desc' ? 'tab-active' : ''" @click="tab='desc'">توضیحات</button>
                <button class="tab flex-1" :class="tab === 'reviews' ? 'tab-active' : ''" @click="tab='reviews'">نظرات</button>
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

              <!-- انتخاب پلن (جدید) -->
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
                </div>
              </div>

              <div class="mt-4 flex items-center justify-between gap-3">
                <!-- Price (right side in RTL) -->
                <PriceTag :price="displayPrice" :compareAt="displayCompareAt" />

                <!-- Quantity (stick to LEFT) -->
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
                <button class="btn btn-primary w-full" @click="add">افزودن به سبد</button>
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

            <!-- چرا میتراپی؟ حذف شد -->
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
          <button class="btn btn-primary" @click="add">خرید</button>
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
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import PriceTag from '@/components/PriceTag.vue'
import RatingStars from '@/components/RatingStars.vue'
import QuantityInput from '@/components/QuantityInput.vue'

const route = useRoute()
const store = useProductsStore()
const cart = useCartStore()

const qty = ref(1)
const product = ref<any>(null)

const tab = ref<'desc' | 'reviews'>('desc')
const detailsRef = ref<HTMLElement | null>(null)

/** options */
const purchaseOptions = computed(() => {
  const options = product.value?.buyItems || product.value?.offers || product.value?.options
  if (Array.isArray(options) && options.length) return options
  return product.value ? [product.value] : []
})

/** normalize labels for dropdowns */
function getPlanTypeLabel(o: any) {
  return (
      o?.subscriptionType ||
      o?.planType ||
      o?.type ||
      o?.kind ||
      o?.tier ||
      'استاندارد'
  )
}

function getDurationLabel(o: any) {
  return (
      o?.duration ||
      o?.period ||
      o?.term ||
      o?.months ||
      o?.days ||
      ''
  )
}

const normalizedOptions = computed(() => {
  return (purchaseOptions.value || []).map((o: any) => ({
    ...o,
    _type: String(getPlanTypeLabel(o) || 'استاندارد'),
    _duration: String(getDurationLabel(o) || '').trim()
  }))
})

const selectedPlanType = ref<string>('')
const selectedPlanDuration = ref<string>('')

const planTypes = computed(() => {
  const set = new Set<string>()
  normalizedOptions.value.forEach((o: any) => set.add(o._type))
  return Array.from(set)
})

const planDurations = computed(() => {
  const set = new Set<string>()
  const pool =
      selectedPlanType.value
          ? normalizedOptions.value.filter((o: any) => o._type === selectedPlanType.value)
          : normalizedOptions.value

  pool.forEach((o: any) => {
    if (o._duration) set.add(o._duration)
  })
  return Array.from(set)
})

/** chosen offer */
const selectedOffer = computed(() => {
  const opts = normalizedOptions.value
  if (!opts.length) return null

  // match both when possible
  const both = opts.find((o: any) => {
    const typeOk = selectedPlanType.value ? o._type === selectedPlanType.value : true
    const durOk = selectedPlanDuration.value ? o._duration === selectedPlanDuration.value : true
    return typeOk && durOk
  })
  if (both) return both

  // match type only
  const byType = opts.find((o: any) => (selectedPlanType.value ? o._type === selectedPlanType.value : true))
  return byType || opts[0]
})

const selectedTitle = computed(() => (selectedOffer.value?.title || product.value?.title || '').trim())
const selectedSubline = computed(() => {
  const o: any = selectedOffer.value
  const bits = [o?._type, o?._duration].filter(Boolean)
  return bits.length ? bits.join(' • ') : ''
})

const displayPrice = computed(() => selectedOffer.value?.price ?? product.value?.price)
const displayCompareAt = computed(() => selectedOffer.value?.compareAt ?? product.value?.compareAt)

/** gallery */
const galleryImages = computed<string[]>(() => {
  const imgs = product.value?.images
  if (Array.isArray(imgs) && imgs.length) return imgs.filter(Boolean)
  return [product.value?.image || 'https://placehold.co/1200x700']
})
const activeImage = ref<string>('')

/** zoom */
const zoomRef = ref<HTMLDialogElement | null>(null)
function openZoom() {
  zoomRef.value?.showModal?.()
}
function closeZoom() {
  zoomRef.value?.close?.()
}

onMounted(async () => {
  product.value = await store.find(route.params.slug as string)
  activeImage.value = galleryImages.value[0]

  // init dropdown defaults
  const first = normalizedOptions.value?.[0]
  if (first) {
    selectedPlanType.value = first._type
    selectedPlanDuration.value = first._duration || ''
  }
})

watch(galleryImages, (imgs) => {
  if (!imgs?.length) return
  if (!imgs.includes(activeImage.value)) activeImage.value = imgs[0]
})

watch([planTypes, planDurations], () => {
  // keep selections valid when type changes
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

function add() {
  if (!product.value) return
  const id = selectedOffer.value?.id ?? product.value.id
  cart.add(id, qty.value)
}

function scrollToDetails() {
  const el = detailsRef.value
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { scrollbar-width: none; }
</style>
