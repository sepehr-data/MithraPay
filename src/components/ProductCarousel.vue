<template>
  <div class="relative">
    <!-- Track -->
    <div
        ref="trackRef"
        class="pc-track"
        dir="rtl"
        @scroll="onScroll"
    >
      <div
          v-for="p in products"
          :key="p.id"
          class="pc-item"
          dir="rtl"
      >
        <ProductCard :product="p" />
      </div>
    </div>

    <!-- Arrows -->
    <button
        v-if="canNavigate"
        type="button"
        class="pc-arrow pc-arrow--right"
        @click="prev"
        aria-label="قبلی"
    >
      ‹
    </button>

    <button
        v-if="canNavigate"
        type="button"
        class="pc-arrow pc-arrow--left"
        @click="next"
        aria-label="بعدی"
    >
      ›
    </button>

    <!-- Dots -->
    <div v-if="canNavigate" class="pc-dots">
      <button
          v-for="i in pages"
          :key="i"
          type="button"
          class="pc-dot"
          :class="i - 1 === page ? 'pc-dot--active' : ''"
          @click="go(i - 1)"
          :aria-label="`صفحه ${i}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import type { Product } from '@/services/types'
import ProductCard from '@/components/ProductCard.vue'

const props = defineProps<{ products: Product[] }>()

const trackRef = ref<HTMLDivElement | null>(null)
const rootRef = ref<HTMLElement | null>(null)

const perView = ref(4)
const page = ref(0)
const pages = ref(1)

let ro: ResizeObserver | null = null
let raf = 0

function readPerView() {
  // --per داخل CSS set شده
  const el = rootRef.value
  if (!el) return
  const v = getComputedStyle(el).getPropertyValue('--per').trim()
  const n = Number(v)
  if (Number.isFinite(n) && n > 0) perView.value = n
}

function recalcPages() {
  const total = props.products?.length ?? 0
  pages.value = Math.max(1, Math.ceil(total / perView.value))
  page.value = Math.min(page.value, pages.value - 1)
}

const canNavigate = computed(() => (props.products?.length ?? 0) > perView.value)

function scrollToPage(p: number) {
  const el = trackRef.value
  if (!el) return
  const x = p * el.clientWidth
  el.scrollTo({ left: x, behavior: 'smooth' })
}

function next() {
  const p = Math.min(pages.value - 1, page.value + 1)
  page.value = p
  scrollToPage(p)
}

function prev() {
  const p = Math.max(0, page.value - 1)
  page.value = p
  scrollToPage(p)
}

function go(p: number) {
  page.value = p
  scrollToPage(p)
}

function onScroll() {
  const el = trackRef.value
  if (!el) return
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    const p = Math.round(el.scrollLeft / Math.max(1, el.clientWidth))
    page.value = Math.min(Math.max(p, 0), pages.value - 1)
  })
}

onMounted(() => {
  // ریشه برای خواندن CSS var
  rootRef.value = trackRef.value?.parentElement as HTMLElement

  readPerView()
  recalcPages()

  ro = new ResizeObserver(() => {
    readPerView()
    recalcPages()
  })
  if (rootRef.value) ro.observe(rootRef.value)
})

onBeforeUnmount(() => {
  if (ro && rootRef.value) ro.unobserve(rootRef.value)
  ro = null
  cancelAnimationFrame(raf)
})
</script>

<style scoped>
/* تعداد کارت در هر ویو */
:host, .relative {
  --per: 2;
  --gap: .9rem;
}

@media (max-width: 420px) {
  :host, .relative { --per: 1; }
}
@media (min-width: 640px) {
  :host, .relative { --per: 3; }
}
@media (min-width: 1024px) {
  :host, .relative { --per: 4; }
}

.pc-track{
  display: flex;
  gap: var(--gap);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding: 4px;
  padding: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.pc-track::-webkit-scrollbar{ display:none; }

.pc-item{
  flex: 0 0 calc((100% - (var(--gap) * (var(--per) - 1))) / var(--per));
  scroll-snap-align: start;
  min-width: 0;
}

/* arrows */
.pc-arrow{
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  border-radius: 999px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size: 22px;
  background: color-mix(in oklab, var(--b1) 70%, transparent);
  border: 1px solid color-mix(in oklab, var(--b3) 70%, transparent);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 20px rgba(0,0,0,.08);
  color: color-mix(in oklab, var(--bc) 80%, transparent);
}
.pc-arrow:hover{
  background: color-mix(in oklab, var(--p) 20%, var(--b1));
  border-color: color-mix(in oklab, var(--p) 35%, var(--b3));
}
.pc-arrow--left{ left: 10px; }
.pc-arrow--right{ right: 10px; }

/* dots */
.pc-dots{
  margin-top: .6rem;
  display:flex;
  justify-content:center;
  gap:.45rem;
}
.pc-dot{
  width: 8px;
  height: 8px;
  border-radius: 999px;
  border: 1px solid color-mix(in oklab, var(--b3) 70%, transparent);
  background: color-mix(in oklab, var(--b1) 80%, transparent);
  transition: all .18s ease;
}
.pc-dot--active{
  width: 22px;
  background: var(--p);
  border-color: color-mix(in oklab, var(--p) 60%, var(--b3));
}
</style>
