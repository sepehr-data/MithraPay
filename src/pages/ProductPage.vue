<template>
  <div class="product-page space-y-10">
    <Breadcrumbs
      class="mt-2"
      :crumbs="[
        { title: 'محصولات', to: '/category/accounts' },
        { title: product?.title || '...' }
      ]"
    />

    <div v-if="!product" class="skeleton h-72 w-full rounded-2xl"></div>

    <div v-else class="content-wrapper">
      <div class="header-card">
        <div class="header-media">
          <img
            :src="product.image || 'https://placehold.co/900x550'"
            class="hero-image"
            :alt="product.title"
          />
        </div>
        <div class="header-details">
          <p class="overline">{{ product.tags?.join(' • ') || 'پیشنهاد ویژه' }}</p>
          <h1 class="title">{{ product.title }}</h1>
          <p class="subtitle">{{ product.description }}</p>

          <div class="meta-row">
            <RatingStars :value="product.rating || 4.5" />
            <PriceTag :price="product.price" :compareAt="product.compareAt" />
          </div>

          <div class="badge-row" v-if="product.isDigital">
            <span class="pill">تحویل دیجیتال • فوری</span>
          </div>
        </div>
      </div>

      <div class="main-grid">
        <section class="primary-column">
          <div class="card">
            <div class="section-header">
              <div>
                <h2 class="section-title">انتخاب پیشنهاد خرید</h2>
                <p class="section-subtitle">پکیج دلخواه خود را انتخاب کنید. لیست زیر به صورت واکنش‌گرا چیدمان می‌شود.</p>
              </div>
            </div>

            <div class="purchase-grid">
              <button
                v-for="(item, index) in purchaseOptions"
                :key="index"
                class="option-card"
                type="button"
                :aria-pressed="index === selectedIndex"
                @click="selectedIndex = index"
              >
                <div class="option-top">
                  <div>
                    <p class="option-title">{{ item.title || product.title }}</p>
                    <p class="option-desc">{{ item.description || 'موجود برای خرید فوری' }}</p>
                  </div>
                  <span class="option-badge" v-if="index === selectedIndex">انتخاب شده</span>
                </div>
                <div class="option-bottom">
                  <div class="option-price">
                    <PriceTag :price="item.price || product.price" :compareAt="item.compareAt || product.compareAt" />
                  </div>
                  <span class="option-meta">{{ item.region || item.tag || 'بدون محدودیت منطقه‌ای' }}</span>
                </div>
              </button>
            </div>
          </div>

          <div class="card">
            <h2 class="section-title">توضیحات</h2>
            <p class="body-text">{{ product.description }}</p>
          </div>

          <div class="card" v-if="product.faq?.length">
            <h2 class="section-title">سوالات متداول</h2>
            <div class="faq-list">
              <details v-for="(faq, i) in product.faq" :key="i" class="faq-item">
                <summary class="faq-question">
                  <span>{{ faq.question }}</span>
                  <span class="chevron">⌄</span>
                </summary>
                <p class="faq-answer">{{ faq.answer }}</p>
              </details>
            </div>
          </div>

          <div class="card trust-card">
            <div class="trust-item" v-for="trust in trustItems" :key="trust.title">
              <span class="trust-icon">{{ trust.icon }}</span>
              <div>
                <p class="trust-title">{{ trust.title }}</p>
                <p class="trust-subtitle">{{ trust.subtitle }}</p>
              </div>
            </div>
          </div>
        </section>

        <aside class="sidebar">
          <div class="card sticky-card">
            <div class="sidebar-header">
              <p class="sidebar-label">سفارش شما</p>
              <h3 class="sidebar-title">{{ product.title }}</h3>
            </div>
            <div class="sidebar-price">
              <PriceTag :price="product.price" :compareAt="product.compareAt" />
            </div>
            <div class="sidebar-actions">
              <QuantityInput v-model="qty" />
              <button class="btn btn-primary w-full" @click="add">افزودن به سبد</button>
            </div>
            <div class="sidebar-note" v-if="product.isDigital">
              <p>تحویل این محصول دیجیتال است (از طریق پنل/ایمیل).</p>
            </div>
          </div>
        </aside>
      </div>
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
  { icon: '⚡', title: 'تحویل آنی کد', subtitle: 'بدون معطلی و در لحظه' },
  { icon: '✅', title: '۱۰۰٪ قانونی و اورجینال', subtitle: 'خرید مطمئن و معتبر' },
  { icon: '🛡️', title: 'ضمانت پرداخت امن', subtitle: 'پرداخت امن از طریق درگاه معتبر' },
  { icon: '💬', title: 'پشتیبانی ۲۴/۷', subtitle: 'پاسخگویی سریع در تمام ساعات' }
]

const purchaseOptions = computed(() => {
  const options = product.value?.buyItems || product.value?.offers || product.value?.options
  if (Array.isArray(options) && options.length) return options
  return product.value ? [product.value] : []
})

onMounted(async () => {
  product.value = await store.find(route.params.slug as string)
})

function add() {
  if (!product.value) return
  cart.add(product.value.id, qty.value)
}
</script>

<style scoped>
.product-page {
  background: linear-gradient(180deg, #f8fafc 0%, #f3f4f6 100%);
  padding-inline: min(5vw, 2.5rem);
  padding-bottom: 4rem;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  background: #fff;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
}

@media (min-width: 1024px) {
  .header-card {
    grid-template-columns: 1.2fr 1fr;
    align-items: center;
  }
}

.header-media {
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a, #1d4ed8);
}

.hero-image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}

.header-details {
  display: grid;
  gap: 0.75rem;
}

.overline {
  color: #6b7280;
  font-size: 0.95rem;
  font-weight: 600;
}

.title {
  font-size: clamp(1.8rem, 2.4vw, 2.4rem);
  font-weight: 800;
  color: #0f172a;
}

.subtitle {
  color: #4b5563;
  line-height: 1.7;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.badge-row {
  display: flex;
  gap: 0.5rem;
}

.pill {
  padding: 0.35rem 0.9rem;
  background: #eef2ff;
  color: #4338ca;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9rem;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .main-grid {
    grid-template-columns: minmax(0, 1.7fr) minmax(320px, 0.85fr);
    align-items: start;
  }
}

.primary-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card {
  background: #fff;
  border-radius: 20px;
  padding: 1.25rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
}

.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 0.75rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
}

.section-subtitle {
  color: #6b7280;
  margin-top: 0.25rem;
  line-height: 1.6;
}

.purchase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.75rem;
  width: 100%;
}

.option-card {
  width: 100%;
  text-align: start;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1rem 1.1rem;
  display: grid;
  gap: 0.75rem;
  transition: all 0.2s ease;
}

.option-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}

.option-card[aria-pressed='true'] {
  border-color: #4f46e5;
  background: #eef2ff;
  box-shadow: 0 16px 32px rgba(79, 70, 229, 0.12);
}

.option-top,
.option-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.option-title {
  font-weight: 700;
  color: #0f172a;
}

.option-desc {
  color: #6b7280;
  margin-top: 0.2rem;
  font-size: 0.95rem;
}

.option-badge {
  padding: 0.25rem 0.65rem;
  background: #4f46e5;
  color: #fff;
  border-radius: 999px;
  font-size: 0.85rem;
  white-space: nowrap;
}

.option-meta {
  color: #475569;
  font-weight: 600;
}

.body-text {
  color: #4b5563;
  line-height: 1.8;
}

.faq-list {
  display: grid;
  gap: 0.75rem;
}

.faq-item {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 0.75rem 1rem;
  background: #f9fafb;
}

.faq-question {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  color: #0f172a;
}

.faq-answer {
  margin-top: 0.6rem;
  color: #4b5563;
  line-height: 1.6;
}

.chevron {
  font-size: 1.1rem;
  color: #94a3b8;
}

.trust-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.5rem;
  border-radius: 12px;
  background: #f8fafc;
}

.trust-icon {
  font-size: 1.4rem;
}

.trust-title {
  font-weight: 800;
  color: #0f172a;
}

.trust-subtitle {
  color: #6b7280;
  font-size: 0.95rem;
}

.sidebar {
  position: relative;
}

.sticky-card {
  position: sticky;
  top: 1.25rem;
  display: grid;
  gap: 1rem;
}

.sidebar-label {
  color: #6b7280;
  font-weight: 700;
}

.sidebar-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f172a;
}

.sidebar-price {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.75rem;
}

.sidebar-actions {
  display: grid;
  gap: 0.75rem;
}

.sidebar-note {
  background: #eef2ff;
  color: #4338ca;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  line-height: 1.6;
}

@media (max-width: 639px) {
  .header-card,
  .card {
    padding: 1rem;
  }

  .purchase-grid {
    grid-template-columns: 1fr;
  }
}
</style>
