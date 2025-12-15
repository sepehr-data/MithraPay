<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <transition name="fade">
      <div
          v-if="ui.isCartOpen"
          class="fixed inset-0 z-[99998] bg-black/45"
          @click="ui.closeCart()"
      />
    </transition>

    <!-- Drawer -->
    <aside
        class="fixed inset-y-0 left-0 z-[99999]
             w-[88vw] max-w-[360px]
             bg-base-100 border-r border-base-300 shadow-2xl
             transform transition-transform duration-300"
        :class="ui.isCartOpen ? 'translate-x-0' : '-translate-x-full'"
        dir="rtl"
        @click.stop
    >
      <div class="h-full flex flex-col">
        <!-- Header -->
        <div class="px-4 pt-4 pb-3 border-b border-base-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                  class="h-11 w-11 rounded-3xl border border-base-200 bg-base-100 shadow-sm
                       flex items-center justify-center"
              >
                <span class="text-lg">🛒</span>
              </div>

              <div>
                <div class="font-black leading-5">سبد خرید</div>
                <div class="text-xs opacity-70 mt-1">{{ cart.items.length }} آیتم</div>
              </div>
            </div>

            <button class="btn btn-ghost btn-sm rounded-2xl" @click="ui.closeCart()">✕</button>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-4 py-4 pb-[168px]">
          <!-- Empty -->
          <div
              v-if="cart.items.length === 0"
              class="rounded-3xl border border-base-200 bg-base-100 p-5"
          >
            <div class="flex items-start gap-3">
              <div class="h-12 w-12 rounded-3xl bg-base-200 flex items-center justify-center">
                <span class="text-xl">🧺</span>
              </div>

              <div class="flex-1">
                <div class="font-black mb-1">سبدت خالیه</div>
                <div class="text-sm opacity-70">یه محصول اضافه کن تا اینجا پر بشه.</div>

                <button class="btn btn-primary w-full rounded-2xl mt-4" @click="ui.closeCart()">
                  شروع خرید
                </button>
              </div>
            </div>
          </div>

          <!-- Items -->
          <div v-else class="space-y-3">
            <div
                v-for="line in cart.detailed"
                :key="line.productId"
                class="rounded-3xl border border-base-200 bg-base-100 p-3 shadow-sm
                     hover:shadow-md hover:border-base-300 transition-all"
            >
              <div class="flex gap-3">
                <img
                    :src="line.product.image || 'https://placehold.co/160x160'"
                    class="h-20 w-20 rounded-3xl object-cover border border-base-200"
                    alt=""
                />

                <div class="flex-1 min-w-0">
                  <!-- title + remove -->
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <div class="font-black truncate">{{ line.product.title }}</div>
                      <div class="text-xs opacity-70 mt-1">
                        {{ money(line.product.price) }}
                        <span class="opacity-60"> تومان</span>
                        <span class="opacity-60"> / واحد</span>
                      </div>
                    </div>

                    <!-- remove (کوچیک‌تر + هاور قرمز) -->
                    <button
                        class="remove-emoji"
                        @click="cart.remove(line.productId)"
                        title="حذف"
                        aria-label="remove"
                    >
                      🗑️
                    </button>
                  </div>

                  <!-- qty (با مارجین/پدینگ به سمت چپ) -->
                  <div class="mt-3 flex items-center justify-start">
                    <div class="qty-pill mr-3 pl-2">
                      <QuantityInput
                          v-model="(line as any).qty"
                          @update:model-value="cart.setQty(line.productId, $event)"
                      />
                    </div>
                  </div>

                  <!-- line total (چینش جدا و تمیز) -->
                  <div class="mt-2 flex items-baseline justify-end gap-1">
                    <div class="text-[11px] opacity-60 ml-2">قیمت</div>
                    <div class="font-black whitespace-nowrap">
                      {{ money(line.lineTotal) }}
                    </div>
                    <div class="text-[11px] opacity-70">تومان</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Clear cart button -->
            <button class="clear-cart" @click="clearAll()">
              <span class="text-lg">🧹</span>
              خالی کردن کل سبد
            </button>
          </div>
        </div>

        <!-- Bottom checkout (مثل نمونه‌ای که دادی) -->
        <div class="sticky bottom-0 border-t border-base-200 bg-base-100">
          <div class="p-4">
            <div class="rounded-3xl border border-base-200 bg-base-100 shadow-sm p-3">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xs opacity-70">جمع کل</div>
                  <div class="flex items-baseline gap-1">
                    <div class="text-lg font-black">{{ money(cart.total) }}</div>
                    <div class="text-[11px] opacity-70">تومان</div>
                  </div>
                </div>

                <div class="text-left">
                  <div class="text-xs opacity-70">آیتم‌ها</div>
                  <div class="font-black">{{ cart.items.length }}</div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 mt-3">

                <RouterLink
                    to="/checkout"
                    class="btn btn-primary rounded-2xl"
                    :class="cart.items.length === 0 ? 'btn-disabled' : ''"
                    @click="cart.items.length === 0 ? $event.preventDefault() : ui.closeCart()"
                >
                  پرداخت
                </RouterLink>
                <button class="btn btn-ghost rounded-2xl" @click="ui.closeCart()">
                  ادامه مرور
                </button>


              </div>
            </div>
          </div>
        </div>

      </div>
    </aside>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useCartStore } from '@/stores/cart'
import { formatToman } from '@/services/currency'
import QuantityInput from './QuantityInput.vue'

const ui = useUiStore()
const cart = useCartStore()

// عددِ قیمت بدون "تومان" (برای جلوگیری از تکرار)
const money = (n: number) => String(formatToman(n)).replace(/تومان/g, '').trim()

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') ui.closeCart()
}

watch(
    () => ui.isCartOpen,
    (v) => {
      document.documentElement.style.overflow = v ? 'hidden' : ''
    },
    { immediate: true }
)

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})

const clearAll = () => {
  ;(cart as any).clear?.()
  ;(cart as any).clearCart?.()
  ;(cart as any).reset?.()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* remove: کوچیک‌تر + هاور قرمز (بدون کادر) */
.remove-emoji{
  background: transparent;
  border: none;
  padding: 0;
  line-height: 1;
  font-size: 16px;
  cursor: pointer;
  opacity: .85;
  transition: transform .15s ease, filter .15s ease, opacity .15s ease;
}
.remove-emoji:hover{
  opacity: 1;
  transform: scale(1.06);
  filter: saturate(4) hue-rotate(310deg) drop-shadow(0 0 6px rgba(239,68,68,.35));
}

/* qty capsule */
.qty-pill{
  border: 1px solid rgba(0,0,0,.10);
  background: rgba(255,255,255,.9);
  border-radius: 18px;
  padding: 6px 8px;
  box-shadow: 0 6px 18px rgba(0,0,0,.06);
  transform: translateY(6px);
  max-width: 150px;
}

/* clear cart */
.clear-cart{
  width: 100%;
  height: 44px;
  border-radius: 18px;
  border: 1px dashed rgba(239,68,68,.55);
  background: rgba(239,68,68,.06);
  color: rgba(185,28,28,1);
  font-weight: 950;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform .12s ease, background .12s ease;
}
.clear-cart:hover{
  transform: translateY(-1px);
  background: rgba(239,68,68,.10);
}
</style>
