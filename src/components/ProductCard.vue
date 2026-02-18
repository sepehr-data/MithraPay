<template>
  <div class="card bg-base-100 shadow-md hover:shadow-lg transition overflow-hidden">
    <figure class="relative aspect-[1/1] overflow-hidden bg-base-200">
      <img
          :src="product.image_url || 'https://placehold.co/600x400?text=Product'"
          :alt="product.title"
          class="w-full h-full object-cover"
          loading="lazy"
      />
      <span
          v-if="isDigital"
          class="absolute left-2 top-2 rounded-full bg-primary text-primary-content px-2.5 py-1 text-[11px] font-bold shadow"
      >
        دیجیتال
      </span>
    </figure>

    <div class="card-body px-4 py-3 gap-2 flex flex-col">
      <RouterLink
          :to="{ name: 'product', params: { id: product.id.toString() } }"
          class="card-title text-base leading-6 line-clamp-2"
          :title="product.title"
      >
        {{ product.title }}
      </RouterLink>

      <div class="flex items-center gap-2">
        <RatingStars :value="product.rating ?? 4.5" />
      </div>

      <div class="flex items-start justify-between gap-2">
        <div class="flex flex-col items-start leading-tight">
          <div v-if="hasDiscount" class="text-xs text-base-content/60 line-through">
            {{ formatToman(compareAt) }}
          </div>
          <div class="text-base font-extrabold">
            {{ formatToman(price) }}
          </div>
          <div v-if="hasDiscount" class="mt-1 text-[11px] font-bold text-error">
            {{ discountPercent }}٪ تخفیف
          </div>
        </div>

        <!-- ✅ اگر داخل سبد هست: کنترل تعداد -->
        <div v-if="inCart" class="min-w-[120px]">
          <QuantityInput
              :model-value="cartQty"
              :disabled="loading"
              @update:model-value="handleQtyChange"
              @update:modelValue="handleQtyChange"
          />
        </div>

        <!-- ✅ اگر داخل سبد نیست: دکمه افزودن -->
        <button
            v-else
            class="btn btn-primary btn-sm"
            @click="handleAddToCart"
            :disabled="loading"
        >
          {{ loading ? "در حال افزودن..." : "افزودن" }}
        </button>
      </div>

      <RouterLink
          :to="{ name: 'product', params: { id: product.id.toString() } }"
          class="btn btn-ghost btn-sm self-end justify-end text-right mt-auto"
      >
        جزئیات
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductDto } from "@/types/api_client_types/products.dto.ts"
import { computed, ref, watch } from "vue"
import { useCartStore } from "@/stores/cart"
import { useAuthStore } from "@/stores/auth"
import { useRouter, useRoute } from "vue-router"
import RatingStars from "./RatingStars.vue"
import QuantityInput from "./QuantityInput.vue"

import { addCartItem, getCart, updateCartItemQty } from "@/services/cart"
import type { AddCartItemPayload, AddCartItemResponse } from "@/types/api_client_types/cart.dto.ts"

const props = defineProps<{ product: ProductDto }>()

const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const loading = ref(false)

// اگر کاربر لاگین نبود و qty رو تغییر داد، بعد از لاگین اعمالش کنیم
const pendingQty = ref<number | null>(null)

/** عددسازی مقاوم */
function toNumber(v: unknown): number {
  if (v === null || v === undefined) return 0
  const s = String(v).trim()
  if (!s) return 0
  const n = Number(s.replace(/[^0-9.\-]/g, ""))
  return Number.isFinite(n) ? n : 0
}

/** فرمت تومان */
function formatToman(n: number): string {
  return `${Math.round(n).toLocaleString("fa-IR")} تومان`
}

// ✅ قیمت و مقایسه
const price = computed(() => toNumber(props.product.price))
const compareAt = computed(() => toNumber(props.product.compare_at_price ?? 0))
const hasDiscount = computed(() => compareAt.value > price.value && compareAt.value > 0 && price.value > 0)
const discountPercent = computed(() => {
  if (!hasDiscount.value) return 0
  return Math.max(1, Math.min(99, Math.round(((compareAt.value - price.value) / compareAt.value) * 100)))
})

const isDigital = computed(() => {
  const dt = (props.product.delivery_type ?? "").toLowerCase()
  if (dt === "digital") return true
  if (props.product.stock === null) return true
  return false
})

/** -------------------------------
 * ✅ پیدا کردن آیتم در سبد (از استور)
 * store: items: { productId, qty, meta }
 * meta: CartItemDto و meta.id همان itemId سرور
 * -------------------------------- */
const productId = computed(() => props.product.id)

const existing = computed(() => {
  const pid = String(productId.value)
  return (cart.items as any[]).find((it) => String(it.productId) === pid) || null
})

const inCart = computed(() => Boolean(existing.value))
const cartQty = computed(() => Number(existing.value?.qty ?? 0))
const cartItemId = computed(() => {
  const raw = existing.value?.meta?.id
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
})

/** -------------------------------
 * ✅ helpers
 * -------------------------------- */
async function syncCartFromServer() {
  const fresh = await getCart()
  cart.setCart(fresh)
}

async function addToCartWithApi(payload: AddCartItemPayload) {
  loading.value = true
  try {
    const res: AddCartItemResponse = await addCartItem(payload)
    cart.setCart(res)
  } catch (err) {
    console.error("add to cart error:", err)
  } finally {
    loading.value = false
  }
}

/** افزودن به کارت */
async function handleAddToCart() {
  const pid = productId.value
  if (!pid) return

  const payload: AddCartItemPayload = { product_id: pid, quantity: 1 }

  if (!auth.isAuthenticated) {
    pendingQty.value = 1
    router.push({ name: "login", query: { redirect: route.fullPath } })
    return
  }

  await addToCartWithApi(payload)
}

/** ✅ تغییر تعداد با API جدید */
async function handleQtyChange(newQty: unknown) {
  console.log("[ProductCard] qty change fired:", newQty, typeof newQty)

  const pid = productId.value
  if (!pid) return

  // QuantityInput ممکنه string بده
  const qty = Number(String(newQty ?? "").trim())
  if (!Number.isFinite(qty)) return

  // اگر لاگین نیست
  if (!auth.isAuthenticated) {
    pendingQty.value = qty
    router.push({ name: "login", query: { redirect: route.fullPath } })
    return
  }

  // اگر آیتم هنوز تو استور نیست، با add بساز
  if (!existing.value) {
    if (qty <= 0) return
    await addToCartWithApi({ product_id: pid, quantity: qty })
    return
  }

  const itemId = cartItemId.value
  console.log("[ProductCard] resolved itemId:", itemId)

  // اگر itemId نداریم، sync بگیر
  if (!itemId) {
    try {
      await syncCartFromServer()
    } catch (e) {
      console.error("syncCart failed:", e)
    }
    return
  }

  // ✅ optimistic
  cart.setQty(String(pid), Math.max(1, qty))

  loading.value = true
  try {
    console.log("[ProductCard] PATCH / update qty:", itemId, qty)
    const res = await updateCartItemQty(itemId, { quantity: qty })
    cart.setCart(res)
  } catch (e) {
    console.error("update qty failed:", e)
    try {
      await syncCartFromServer()
    } catch (e2) {
      console.error("sync after update failed:", e2)
    }
  } finally {
    loading.value = false
  }
}

/** بعد از لاگین، qty معلق را اعمال کن */
watch(
    () => auth.isAuthenticated,
    async (ok) => {
      if (!ok) return
      if (pendingQty.value == null) return

      const qty = pendingQty.value
      pendingQty.value = null

      if (!existing.value) {
        if (qty > 0) await addToCartWithApi({ product_id: productId.value, quantity: qty })
        return
      }

      await handleQtyChange(qty)
    }
)
</script>
