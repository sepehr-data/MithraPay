<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <transition name="fade">
      <div
          v-if="ui.isCartOpen"
          class="fixed inset-0 z-[99998] bg-black/35"
          @click="ui.closeCart()"
      />
    </transition>

    <!-- Drawer -->
    <aside
        class="fixed inset-y-0 left-0 z-[99999]
             w-[84vw] max-w-[320px]
             bg-base-100 border-r border-base-200
             shadow-2xl
             transform transition-transform duration-250 ease-out"
        :class="ui.isCartOpen ? 'translate-x-0' : '-translate-x-full'"
        dir="rtl"
        @click.stop
    >
      <div class="h-full flex flex-col">
        <!-- Header -->
        <header class="px-4 py-4 border-b border-base-200">
          <div class="flex items-center justify-between">
            <div class="min-w-0">
              <div class="text-sm font-semibold">سبد خرید</div>
              <div class="text-xs text-base-content/60 mt-1">
                {{ cart.items.length }} آیتم
              </div>
            </div>

            <button
                class="btn btn-ghost btn-sm rounded-xl"
                @click="ui.closeCart()"
                aria-label="close"
                type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-y-auto px-4 py-3 cart-scroll">
          <!-- Empty -->
          <div
              v-if="cart.items.length === 0"
              class="rounded-2xl border border-base-200 p-4"
          >
            <div class="flex items-start gap-3">
              <div class="h-10 w-10 rounded-xl border border-base-200 bg-base-200/40 grid place-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M6 6h15l-1.5 9h-12L6 6Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M6 6 5 3H2" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                </svg>
              </div>

              <div class="flex-1">
                <div class="text-sm font-semibold">سبد خرید خالی است</div>
                <div class="text-xs text-base-content/60 mt-1 leading-5">
                  برای ادامه یک محصول اضافه کنید.
                </div>

                <button class="btn btn-primary w-full rounded-xl mt-4" @click="ui.closeCart()" type="button">
                  شروع خرید
                </button>
              </div>
            </div>
          </div>

          <!-- Items -->
          <div v-else>
            <div class="divide-y divide-base-200">
              <div v-for="line in detailed" :key="line.key" class="py-3">
                <div class="flex gap-3">
                  <img
                      :src="line.product.image || 'https://placehold.co/160x160'"
                      class="h-14 w-14 rounded-xl object-cover border border-base-200"
                      alt=""
                  />

                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                      <div class="min-w-0">
                        <div class="text-sm font-semibold truncate">
                          {{ line.product.title }}
                        </div>

                        <div class="mt-1 text-xs text-base-content/60">
                          {{ money(line.product.price) }}
                          <span class="opacity-60">تومان</span>
                        </div>

                        <div v-if="loadingProducts" class="mt-1 text-[10px] text-base-content/45">
                          در حال همگام‌سازی اطلاعات...
                        </div>
                      </div>

                      <button
                          class="icon-btn"
                          :disabled="removingId === line.itemId || clearing || isUpdatingQty(line.itemId)"
                          @click="removeLine(line)"
                          aria-label="remove"
                          title="حذف"
                          type="button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M4 7h16" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M10 11v6" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M14 11v6" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M6 7l1 14h10l1-14" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M9 7V4h6v3" />
                        </svg>
                      </button>
                    </div>

                    <div class="mt-2 flex items-end justify-between gap-3">
                      <div class="qty-wrap">
                        <QuantityInput
                            :model-value="line.qty"
                            :disabled="clearing || isUpdatingQty(line.itemId)"
                            @update:model-value="onQtyInput(line, $event)"
                            @update:modelValue="onQtyInput(line, $event)"
                        />
                      </div>

                      <div class="text-left">
                        <div class="text-[10px] text-base-content/50">جمع</div>
                        <div class="text-sm font-semibold whitespace-nowrap">
                          {{ money(line.lineTotal) }}
                          <span class="text-[10px] font-normal text-base-content/60">تومان</span>
                        </div>
                      </div>
                    </div>

                    <div v-if="line.itemId == null" class="mt-2 text-[10px] text-warning/80">
                      شناسه آیتم سبد موجود نیست؛ آپدیت با API انجام نمی‌شود (فقط تغییر محلی).
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Clear cart -->
            <button
                class="btn btn-ghost w-full rounded-xl border border-base-200 mt-3"
                :disabled="clearing || cart.items.length === 0"
                @click="clearAll"
                type="button"
            >
              خالی کردن سبد
            </button>
          </div>
        </main>

        <!-- Footer -->
        <footer class="border-t border-base-200 bg-base-100">
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-[11px] text-base-content/60">جمع کل</div>
                <div class="text-base font-semibold mt-1">
                  {{ money(cartTotal) }}
                  <span class="text-[11px] font-normal text-base-content/60">تومان</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 mt-3">
              <RouterLink
                  :to="payTo"
                  class="btn btn-primary rounded-xl"
                  :class="cart.items.length === 0 ? 'btn-disabled' : ''"
                  @click="onPayClick"
              >
                پرداخت
              </RouterLink>

              <button class="btn btn-ghost rounded-xl" @click="ui.closeCart()" type="button">
                ادامه
              </button>
            </div>
          </div>
        </footer>
      </div>
    </aside>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useUiStore } from "@/stores/ui"
import { useCartStore } from "@/stores/cart"
import { useAuthStore } from "@/stores/auth"
import { formatToman } from "@/services/currency"
import QuantityInput from "./QuantityInput.vue"
import { getProduct } from "@/services/products"
import type { Product } from "@/services/types"
import { removeCartItem, clearCart, getCart, updateCartItemQty } from "@/services/cart"

const auth = useAuthStore()
const ui = useUiStore()
const cart = useCartStore()

const isLoggedIn = computed(() => Boolean(auth.token))
const payTo = computed(() => (isLoggedIn.value ? "/checkout" : { path: "/auth/login", query: { redirect: "/checkout" } }))

function onPayClick(e: MouseEvent) {
  if (cart.items.length === 0) e.preventDefault()
  ui.closeCart()
}

const money = (n: number) => String(formatToman(Number(n || 0))).replace(/تومان/g, "").trim()

const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape") ui.closeCart()
}

watch(
    () => ui.isCartOpen,
    async (open) => {
      if (!open) return

      if (!auth.token) {
        cart.reset?.()
        return
      }

      try {
        const res = await getCart()
        cart.setCart(res)
      } catch (e) {
        console.error("getCart failed:", e)
      }
    },
    { immediate: true }
)

onMounted(() => window.addEventListener("keydown", onKey))
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey)
  document.documentElement.style.overflow = ""
})

/** --------------------------------
 * Product loading
 * -------------------------------- */
type ProductVM = Product & { image?: string; isDigital?: boolean; title?: string; price?: number }

const productsById = ref<Record<number, ProductVM>>({})
const loadingProducts = ref(false)

function normalizeImageUrl(u?: string | null) {
  const s = String(u ?? "").trim()
  if (!s) return ""
  if (/^https?:\/\//i.test(s)) return s
  if (s.startsWith("/")) return s
  return ""
}

function normalizeProduct(dto: any): ProductVM {
  const raw = dto?.data ?? dto?.product ?? dto
  return {
    ...(raw as any),
    id: raw?.id,
    title: raw?.title ?? "بدون عنوان",
    price: Number(raw?.price ?? 0),
    image: normalizeImageUrl(raw?.image_url || raw?.image) || "",
    isDigital: raw?.is_digital ?? raw?.isDigital,
  }
}

function getProductIdFromItem(it: any): number | null {
  const pid = it?.product_id ?? it?.productId ?? it?.productID
  const n = Number(pid)
  return Number.isFinite(n) ? n : null
}

async function ensureCartProductsLoaded() {
  const ids = (cart.items || [])
      .map((it: any) => getProductIdFromItem(it))
      .filter((n: any): n is number => Number.isFinite(n))

  const missing = ids.filter((id) => !productsById.value[id])
  if (!missing.length) return

  loadingProducts.value = true
  try {
    const res = await Promise.all(
        missing.map(async (id) => {
          const dto = await getProduct(id)
          return [id, normalizeProduct(dto)] as const
        })
    )

    const next = { ...productsById.value }
    res.forEach(([id, p]) => (next[id] = p))
    productsById.value = next
  } catch (e) {
    console.error(e)
  } finally {
    loadingProducts.value = false
  }
}

watch(() => cart.items, () => void ensureCartProductsLoaded(), { deep: true, immediate: true })

/** --------------------------------
 * detailed
 * -------------------------------- */
function getItemId(it: any): number | null {
  const n = Number(it?.id)
  return Number.isFinite(n) && n > 0 ? n : null
}

function getQty(it: any): number {
  const raw = it?.quantity ?? it?.qty ?? 1
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : 1
}

type LineVM = {
  key: string
  itemId: number | null
  productId: number
  qty: number
  product: ProductVM
  lineTotal: number
}

const detailed = computed<LineVM[]>(() => {
  const items = cart.items || []
  return items
      .map((it: any) => {
        const productId = getProductIdFromItem(it)
        if (productId == null) return null

        const qty = getQty(it)
        const itemId = getItemId(it)

        const product =
            productsById.value[productId] ??
            ({
              id: productId,
              title: it?.title ?? "در حال دریافت...",
              price: Number(it?.unit_price ?? 0),
              image: "",
              isDigital: undefined,
            } as any)

        const lineTotal = Number.isFinite(Number(it?.line_total))
            ? Number(it.line_total)
            : (Number((product as any).price ?? 0) || 0) * qty

        return {
          key: String(itemId ?? productId),
          itemId,
          productId,
          qty,
          product,
          lineTotal,
        }
      })
      .filter((x): x is LineVM => Boolean(x))
})

const cartTotal = computed(() => detailed.value.reduce((sum, l) => sum + (l.lineTotal || 0), 0))

/** --------------------------------
 * Remove/Clear
 * -------------------------------- */
const removingId = ref<number | null>(null)
const clearing = ref(false)

/** --------------------------------
 * ✅ Update Qty (PATCH)
 * -------------------------------- */
const pendingQtyByItemId = ref<Record<number, boolean>>({})

function isUpdatingQty(itemId: number | null) {
  if (!itemId) return false
  return Boolean(pendingQtyByItemId.value[itemId])
}

function coerceQty(v: unknown): number {
  const n = Number(String(v ?? "").trim())
  if (!Number.isFinite(n)) return 1
  return Math.max(1, Math.floor(n))
}

async function onQtyInput(line: LineVM, v: unknown) {
  // اگر itemId نداریم، فقط لوکال
  if (line.itemId == null) {
    cart.setQty(String(line.productId), coerceQty(v))
    return
  }

  // جلوگیری از ریکوئست همزمان برای یک آیتم
  if (isUpdatingQty(line.itemId)) return

  const qty = coerceQty(v)

  // optimistic local
  cart.setQty(String(line.productId), qty)

  pendingQtyByItemId.value = { ...pendingQtyByItemId.value, [line.itemId]: true }
  try {
    // ✅ API جدید
    const res = await updateCartItemQty(line.itemId, { quantity: qty })
    cart.setCart(res) // ✅ منبع حقیقت
  } catch (e) {
    console.error("updateCartItemQty failed:", e)
    // اگر خطا شد، از سرور sync کن تا لوکال خراب نمونه
    try {
      const fresh = await getCart()
      cart.setCart(fresh)
    } catch (e2) {
      console.error("getCart after update failed:", e2)
    }
  } finally {
    const next = { ...pendingQtyByItemId.value }
    delete next[line.itemId]
    pendingQtyByItemId.value = next
  }
}

async function removeLine(line: { itemId: number | null; productId: number }) {
  if (line.itemId == null) {
    ;(cart as any).remove?.(String(line.productId))
    return
  }

  // جلوگیری از درخواست تکراری
  if (removingId.value === line.itemId) return

  removingId.value = line.itemId
  try {
    const res = await removeCartItem(line.itemId)
    cart.setCart(res)
  } catch (e) {
    console.error(e)
  } finally {
    removingId.value = null
  }
}

async function clearAll() {
  if (cart.items.length === 0) return
  clearing.value = true
  try {
    const res = await clearCart()
    cart.setCart(res)
  } catch (e) {
    console.error(e)
  } finally {
    clearing.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.cart-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.18) transparent;
}
.cart-scroll::-webkit-scrollbar {
  width: 8px;
}
.cart-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.14);
  border-radius: 999px;
}
.cart-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

.icon-btn {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: transparent;
  display: grid;
  place-items: center;
  opacity: 0.9;
  transition: transform 0.12s ease, border-color 0.12s ease, opacity 0.12s ease;
}
.icon-btn:hover {
  transform: translateY(-1px);
  opacity: 1;
  border-color: rgba(239, 68, 68, 0.3);
}
.icon-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

.qty-wrap {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 14px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.9);
  max-width: 150px;
}
</style>
