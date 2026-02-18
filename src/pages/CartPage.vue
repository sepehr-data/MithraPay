<template>
  <h1 class="text-xl font-bold mb-4">سبد خرید</h1>

  <div v-if="loading" class="alert">در حال بارگذاری...</div>
  <div v-else-if="!cart.items.length" class="alert">سبد خرید شما خالی است.</div>

  <div v-else class="grid lg:grid-cols-[1fr,380px] gap-6">
    <div class="space-y-3">
      <div
          v-for="item in cart.items"
          :key="item.id"
          class="card bg-base-100 border border-base-300"
      >
        <div class="card-body flex-row gap-4 items-center">
          <img
              :src="item.product?.image_url || item.product?.image || 'https://placehold.co/96x96'"
              class="w-24 h-24 rounded-md object-cover"
          />

          <div class="flex-1 min-w-0">
            <div class="font-semibold truncate">
              {{ item.product?.title || item.title_snapshot || `محصول #${item.product_id}` }}
            </div>

            <div class="text-sm opacity-70 mt-1">
              قیمت واحد: {{ price(item.unit_price) }}
            </div>

            <div class="text-[11px] opacity-60 mt-1">
              جمع این آیتم: {{ price(item.line_total) }}
            </div>

            <div class="mt-2">
              <QuantityInput
                  :model-value="item.quantity"
                  @update:model-value="(v:number) => updateItem(item.id, v)"
              />
            </div>

            <!-- نمایش اطلاعات پلن (اگر وجود داشت) -->
            <div class="mt-2 text-xs opacity-70">
              <span v-if="item.subscription_type_id">نوع اشتراک: {{ item.subscription_type_id }}</span>
              <span v-if="item.duration_type_id" class="mr-2">مدت: {{ item.duration_type_id }}</span>
              <span v-if="item.personal_account" class="mr-2 badge badge-ghost">اکانت شخصی</span>
            </div>
          </div>

          <button class="btn btn-ghost btn-sm" @click="removeItem(item.id)">حذف</button>
        </div>
      </div>

      <button class="btn btn-warning mt-3" @click="clearAll">خالی کردن سبد خرید</button>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <div class="flex items-center justify-between">
          <span>جمع کل</span>
          <strong>{{ price(cart.total_amount) }}</strong>
        </div>
        <RouterLink to="/checkout" class="btn btn-primary w-full mt-3">ادامه خرید</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QuantityInput from '@/components/QuantityInput.vue'
import { formatToman } from '@/services/currency'
import { getCart, updateCartItem, removeCartItem, clearCart } from '@/services/cart.ts'

/**
 * ✅ با بک‌اند جدید همخوانی:
 * CartItem: از API میاد و ممکنه Decimal/string باشه
 */
type CartItem = {
  id: number
  product_id: number

  title_snapshot?: string | null

  quantity: number
  unit_price: number
  line_total: number

  product?: any

  duration_type_id?: number | null
  subscription_type_id?: number | null
  personal_account?: boolean
}

type CartState = {
  cart_id?: number
  items: CartItem[]
  total_amount: number
}

const cart = ref<CartState>({ items: [], total_amount: 0 })
const loading = ref(true)

const price = (n: number) => formatToman(n || 0)

function toNumber(v: any): number {
  if (v == null) return 0
  if (typeof v === 'number') return v
  const num = Number(v)
  return Number.isFinite(num) ? num : 0
}

function normalizeCartResponse(data: any): CartState {
  const items: CartItem[] = (data?.items ?? []).map((i: any) => {
    const qty = Math.max(1, toNumber(i.quantity))
    const unit = toNumber(i.unit_price)
    const line = i.line_total != null ? toNumber(i.line_total) : unit * qty

    return {
      id: toNumber(i.id),
      product_id: toNumber(i.product_id),
      title_snapshot: i.title_snapshot ?? i.title ?? null,
      quantity: qty,
      unit_price: unit,
      line_total: line,
      product: i.product,

      duration_type_id: i.duration_type_id ?? null,
      subscription_type_id: i.subscription_type_id ?? null,
      personal_account: !!i.personal_account,
    }
  })

  const total_amount = items.reduce((sum, it) => sum + toNumber(it.line_total), 0)

  return {
    cart_id: data?.cart_id,
    items,
    total_amount,
  }
}

async function fetchCart() {
  loading.value = true
  try {
    const data = await getCart()
    cart.value = normalizeCartResponse(data)
  } catch (e) {
    console.error('fetchCart error:', e)
    cart.value = { items: [], total_amount: 0 }
  } finally {
    loading.value = false
  }
}

async function updateItem(itemId: number, qty: number) {
  const q = Math.max(1, toNumber(qty))
  try {
    const data = await updateCartItem(itemId, { quantity: q })
    cart.value = normalizeCartResponse(data)
  } catch (e) {
    console.error('updateItem error:', e)
    // fallback: sync مجدد
    await fetchCart()
  }
}

async function removeItem(itemId: number) {
  try {
    const data = await removeCartItem(itemId)
    cart.value = normalizeCartResponse(data)
  } catch (e) {
    console.error('removeItem error:', e)
    await fetchCart()
  }
}

async function clearAll() {
  try {
    const data = await clearCart()
    cart.value = normalizeCartResponse(data)
  } catch (e) {
    console.error('clearAll error:', e)
    cart.value = { items: [], total_amount: 0 }
  }
}

onMounted(fetchCart)
</script>
