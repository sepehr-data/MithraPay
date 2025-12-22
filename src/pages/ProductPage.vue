<template>
  <div class="mx-auto max-w-6xl px-4 lg:px-0 py-6 space-y-8" dir="rtl">
    <Breadcrumbs
        class="mt-2"
        :crumbs="[
        { title: 'محصولات', to: '/category/accounts' },
        { title: product?.title || '...' }
      ]"
    />

    <div v-if="!product" class="skeleton h-72 w-full rounded-2xl"></div>

    <div v-else class="space-y-6">
      <!-- HERO (Minimal) -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div class="lg:col-span-7">
          <div class="rounded-2xl border border-base-300 bg-base-100 overflow-hidden">
            <img
                :src="product.image || 'https://placehold.co/900x550'"
                class="w-full h-[240px] sm:h-[320px] object-cover"
                :alt="product.title"
                loading="lazy"
            />
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6 h-full">
            <div class="flex flex-wrap gap-2">
              <span v-if="product.isDigital" class="badge badge-outline">تحویل دیجیتال</span>
              <span class="badge badge-outline" v-if="selectedOffer?.region">ریجن: {{ selectedOffer.region }}</span>
              <span class="badge badge-outline" v-if="selectedOffer?.duration">مدت: {{ selectedOffer.duration }}</span>
              <span class="badge badge-outline" v-if="selectedOffer?.instant">فوری</span>
            </div>

            <h1 class="mt-3 text-xl sm:text-2xl font-extrabold leading-8">
              {{ product.title }}
            </h1>

            <p class="mt-2 text-sm text-base-content/70 leading-7">
              {{ product.description }}
            </p>

            <div class="mt-4 flex items-center justify-between gap-3">
              <RatingStars :value="product.rating || 4.5" />
              <PriceTag :price="displayPrice" :compareAt="displayCompareAt" />
            </div>

            <div v-if="product.tags?.length" class="mt-4 flex flex-wrap gap-2">
              <span v-for="t in product.tags" :key="t" class="badge badge-ghost">
                {{ t }}
              </span>
            </div>

            <div class="mt-5 grid grid-cols-2 gap-2">
              <div class="rounded-xl border border-base-300 bg-base-100 p-3">
                <p class="text-xs text-base-content/60">تحویل</p>
                <p class="text-sm font-semibold mt-1">
                  {{ selectedOffer?.deliveryTime || 'کمتر از چند ساعت' }}
                </p>
              </div>

              <div class="rounded-xl border border-base-300 bg-base-100 p-3">
                <p class="text-xs text-base-content/60">پشتیبانی</p>
                <p class="text-sm font-semibold mt-1">
                  {{ selectedOffer?.support || 'پشتیبانی پاسخگو' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- MAIN -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <!-- Left / main -->
        <div class="lg:col-span-8 space-y-4">
          <!-- Plans -->
          <div class="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h2 class="text-lg font-bold">انتخاب پیشنهاد خرید</h2>
                <p class="text-sm text-base-content/60 mt-1">
                  پلن موردنظرت رو انتخاب کن؛ قیمت و سایدبار به‌صورت خودکار آپدیت می‌شه.
                </p>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                  v-for="(item, index) in purchaseOptions"
                  :key="index"
                  type="button"
                  class="plan-card"
                  :class="{ 'plan-card--active': index === selectedIndex }"
                  :aria-pressed="index === selectedIndex"
                  @click="selectedIndex = index"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="font-semibold truncate">{{ item.title || product.title }}</p>
                    <p class="text-xs text-base-content/60 mt-1 line-clamp-2">
                      {{ item.description || 'موجود برای خرید فوری' }}
                    </p>
                  </div>

                  <span class="radio" :class="{ 'radio--on': index === selectedIndex }" aria-hidden="true"></span>
                </div>

                <div class="mt-3 flex items-end justify-between gap-3">
                  <PriceTag :price="item.price || product.price" :compareAt="item.compareAt || product.compareAt" />

                  <div class="flex flex-wrap gap-1 justify-end">
                    <span v-if="item.region" class="pill">ریجن: {{ item.region }}</span>
                    <span v-if="item.duration" class="pill">مدت: {{ item.duration }}</span>
                    <span v-if="item.instant" class="pill pill-ok">فوری</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Description -->
          <div class="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
            <div class="flex items-center justify-between gap-2">
              <h2 class="text-lg font-bold">توضیحات</h2>
              <span v-if="product.isDigital" class="badge badge-outline">Digital</span>
            </div>
            <p class="mt-3 text-sm text-base-content/70 leading-7">
              {{ product.description }}
            </p>

            <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div class="rounded-xl border border-base-300 p-3">
                <p class="text-xs text-base-content/60">روش تحویل</p>
                <p class="text-sm font-semibold mt-1">{{ selectedOffer?.deliveryMethod || 'پنل / ایمیل' }}</p>
              </div>
              <div class="rounded-xl border border-base-300 p-3">
                <p class="text-xs text-base-content/60">گارانتی</p>
                <p class="text-sm font-semibold mt-1">{{ selectedOffer?.warranty || 'طبق شرایط پلن' }}</p>
              </div>
            </div>
          </div>

          <!-- FAQ -->
          <div v-if="product.faq?.length" class="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
            <h2 class="text-lg font-bold">سوالات متداول</h2>

            <div class="mt-3 space-y-2">
              <details v-for="(faq, i) in product.faq" :key="i" class="faq">
                <summary class="faq__q">
                  <span class="font-semibold">{{ faq.question }}</span>
                  <span class="faq__chev">⌄</span>
                </summary>
                <p class="faq__a">{{ faq.answer }}</p>
              </details>
            </div>
          </div>

          <!-- Trust -->
          <div class="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div v-for="t in trustItems" :key="t.title" class="flex items-start gap-3 rounded-xl border border-base-300 p-4">
                <span class="text-xl">{{ t.icon }}</span>
                <div>
                  <p class="font-semibold">{{ t.title }}</p>
                  <p class="text-sm text-base-content/60 mt-1 leading-6">{{ t.subtitle }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right / sidebar -->
        <aside class="lg:col-span-4">
          <div class="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6 sticky top-5">
            <p class="text-xs text-base-content/60">سفارش شما</p>
            <h3 class="mt-1 font-bold leading-7">
              {{ selectedTitle }}
            </h3>
            <p v-if="selectedSubline" class="text-sm text-base-content/60 mt-1">
              {{ selectedSubline }}
            </p>

            <div class="mt-4">
              <PriceTag :price="displayPrice" :compareAt="displayCompareAt" />
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <span v-if="selectedOffer?.region" class="badge badge-ghost">ریجن: {{ selectedOffer.region }}</span>
              <span v-if="selectedOffer?.duration" class="badge badge-ghost">مدت: {{ selectedOffer.duration }}</span>
              <span v-if="selectedOffer?.instant" class="badge badge-ghost">تحویل فوری</span>
            </div>

            <div class="mt-5 space-y-3">
              <QuantityInput v-model="qty" />
              <button class="btn btn-primary w-full" @click="add">افزودن به سبد</button>
              <button class="btn btn-ghost w-full" @click="scrollToPlans">تغییر پلن</button>
            </div>

            <div v-if="product.isDigital" class="mt-4 rounded-xl border border-base-300 bg-base-200/40 p-3 text-sm text-base-content/70 leading-6">
              تحویل این محصول دیجیتال است و پس از پرداخت ارسال می‌شود.
            </div>
          </div>
        </aside>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
const selectedIndex = ref(0)

const trustItems = [
  { icon: '⚡', title: 'تحویل سریع', subtitle: 'بدون معطلی و دقیق' },
  { icon: '✅', title: 'اورجینال', subtitle: 'اکانت/اشتراک معتبر' },
  { icon: '🛡️', title: 'پرداخت امن', subtitle: 'درگاه معتبر و مطمئن' },
  { icon: '💬', title: 'پشتیبانی', subtitle: 'پاسخگویی سریع' }
]

const purchaseOptions = computed(() => {
  const options = product.value?.buyItems || product.value?.offers || product.value?.options
  if (Array.isArray(options) && options.length) return options
  return product.value ? [product.value] : []
})

const selectedOffer = computed(() => purchaseOptions.value?.[selectedIndex.value] ?? product.value)

const selectedTitle = computed(() => (selectedOffer.value?.title || product.value?.title || '').trim())

const selectedSubline = computed(() => {
  const o = selectedOffer.value
  const bits = [o?.region, o?.duration].filter(Boolean)
  return bits.length ? bits.join(' • ') : ''
})

const displayPrice = computed(() => selectedOffer.value?.price ?? product.value?.price)
const displayCompareAt = computed(() => selectedOffer.value?.compareAt ?? product.value?.compareAt)

onMounted(async () => {
  product.value = await store.find(route.params.slug as string)
})

function add() {
  if (!product.value) return
  const id = selectedOffer.value?.id ?? product.value.id
  cart.add(id, qty.value)
}

function scrollToPlans() {
  // اسکرول نرم به بخش پلن‌ها (مینیمال)
  const el = document.querySelector('.plan-card')?.parentElement
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
/* کارت پلن‌ها: مینیمال و شیک */
.plan-card {
  text-align: start;
  width: 100%;
  border-radius: 1rem;
  border: 1px solid hsl(var(--b3, 0 0% 86%));
  background: hsl(var(--b1));
  padding: 1rem;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}
.plan-card:hover {
  transform: translateY(-1px);
  border-color: hsla(var(--bc), 0.22);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
}
.plan-card--active {
  border-color: hsla(var(--p), 0.55);
  box-shadow: 0 12px 30px rgba(79, 70, 229, 0.10);
}

.radio {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid hsla(var(--bc), 0.22);
  position: relative;
  flex-shrink: 0;
  margin-top: 2px;
}
.radio::after {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: 999px;
  background: hsl(var(--p));
  transform: scale(0);
  transition: transform 140ms ease;
}
.radio--on {
  border-color: hsla(var(--p), 0.55);
}
.radio--on::after {
  transform: scale(1);
}

/* چیپ‌های کوچک مینیمال */
.pill {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  border: 1px solid hsla(var(--bc), 0.14);
  background: hsla(var(--b2), 0.7);
  color: hsla(var(--bc), 0.7);
  white-space: nowrap;
}
.pill-ok {
  border-color: rgba(34, 197, 94, 0.25);
  background: rgba(34, 197, 94, 0.08);
  color: rgba(21, 128, 61, 0.95);
}

/* FAQ مینیمال */
.faq {
  border: 1px solid hsla(var(--bc), 0.12);
  border-radius: 0.9rem;
  padding: 0.85rem 1rem;
  background: hsla(var(--b2), 0.35);
}
.faq[open] {
  background: hsla(var(--b2), 0.55);
}
.faq__q {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  list-style: none;
}
.faq__q::-webkit-details-marker {
  display: none;
}
.faq__a {
  margin-top: 0.65rem;
  color: hsla(var(--bc), 0.7);
  line-height: 1.9;
  font-size: 0.92rem;
}
.faq__chev {
  opacity: 0.5;
}
.line-clamp-2{
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  overflow:hidden;
}
</style>
