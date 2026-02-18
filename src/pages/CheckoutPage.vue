<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <!-- Header -->
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black">تسویه حساب</h1>
      </div>
    </div>

    <!-- Stepper -->
    <div class="stepper mb-6">
      <button
          type="button"
          class="step"
          :class="step === 1 ? 'step--active' : step > 1 ? 'step--done' : ''"
          @click="goTo(1)"
          :disabled="savingProfile"
      >
        <span class="step__num">1</span>
        <span class="step__text">سبد خرید</span>
      </button>

      <div class="stepper__line" :class="step > 1 ? 'stepper__line--on' : ''"></div>

      <button
          type="button"
          class="step"
          :class="step === 2 ? 'step--active' : step > 2 ? 'step--done' : ''"
          @click="goTo(2)"
          :disabled="cart.items.length === 0 || savingProfile"
      >
        <span class="step__num">2</span>
        <span class="step__text">اطلاعات</span>
      </button>

      <div class="stepper__line" :class="step > 2 ? 'stepper__line--on' : ''"></div>

      <button
          type="button"
          class="step"
          :class="step === 3 ? 'step--active' : ''"
          @click="goTo(3)"
          :disabled="!canGoToPayment || savingProfile"
      >
        <span class="step__num">3</span>
        <span class="step__text">پرداخت</span>
      </button>
    </div>

    <!-- Layout -->
    <div class="grid lg:grid-cols-[1fr,380px] gap-6">
      <!-- LEFT -->
      <div>
        <transition name="fade-slide" mode="out-in">
          <!-- STEP 1: Cart -->
          <section v-if="step === 1" key="s1" class="card bg-base-100 border border-base-300 shadow-sm">
            <div class="card-body">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h2 class="text-lg font-extrabold">سبد خرید</h2>
                  <p class="text-xs text-base-content/60 mt-1">{{ cart.items.length }} آیتم</p>
                </div>

                <button
                    v-if="cart.items.length"
                    type="button"
                    class="btn btn-ghost btn-sm rounded-2xl border border-base-200"
                    @click="clearAllServer()"
                    :disabled="clearing || busyAny"
                >
                  <span v-if="!clearing">خالی کردن سبد</span>
                  <span v-else class="loading loading-spinner loading-sm"></span>
                </button>
              </div>

              <!-- Sync loading -->
              <div v-if="syncingCart" class="mt-3 text-xs text-base-content/60">
                در حال دریافت سبد خرید از سرور...
              </div>

              <!-- loading products -->
              <div v-if="loadingProducts && cart.items.length" class="mt-3 text-xs text-base-content/60">
                در حال دریافت اطلاعات محصولات...
              </div>

              <!-- Empty -->
              <div v-if="cart.items.length === 0 && !syncingCart" class="mt-4 rounded-3xl border border-base-200 p-4">
                <div class="text-sm font-semibold">سبد خرید خالی است</div>
                <div class="text-xs text-base-content/60 mt-1">
                  برای ادامه، حداقل یک محصول اضافه کنید.
                </div>

                <RouterLink to="/" class="btn btn-primary rounded-2xl mt-4">
                  رفتن به فروشگاه
                </RouterLink>
              </div>

              <!-- Items -->
              <div v-else-if="cart.items.length" class="mt-4 divide-y divide-base-200">
                <div v-for="line in detailed" :key="line.itemId ?? line.productKey" class="py-4">
                  <div class="flex gap-3">
                    <img
                        :src="line.product.image || 'https://placehold.co/96x96'"
                        class="h-16 w-16 rounded-2xl object-cover border border-base-200"
                        alt=""
                    />

                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-2">
                        <div class="min-w-0">
                          <div class="text-sm font-semibold truncate">
                            {{ line.product.title }}
                          </div>
                          <div class="text-xs text-base-content/60 mt-1">
                            {{ price(line.unitPrice) }}
                            <span class="opacity-60"> / واحد</span>
                          </div>
                        </div>

                        <button
                            type="button"
                            class="icon-btn"
                            @click="removeLineServer(line)"
                            aria-label="remove"
                            title="حذف"
                            :disabled="removingId === line.itemId || busyAny"
                        >
                          <span v-if="removingId === line.itemId" class="loading loading-spinner loading-sm"></span>
                          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M4 7h16" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M10 11v6" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M14 11v6" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M6 7l1 14h10l1-14" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M9 7V4h6v3" />
                          </svg>
                        </button>
                      </div>

                      <div class="mt-3 flex items-end justify-between gap-3">
                        <div class="qty-wrap">
                          <QuantityInput
                              :model-value="line.qty"
                              :disabled="updatingId === line.itemId || busyAny"
                              @update:model-value="(v) => updateQtyServer(line, v)"
                          />
                        </div>

                        <div class="text-left">
                          <div class="text-[10px] text-base-content/50">جمع</div>
                          <div class="text-sm font-semibold whitespace-nowrap">
                            {{ price(line.lineTotal) }}
                          </div>
                        </div>
                      </div>

                      <div class="mt-2 text-[11px] text-base-content/55">
                        <span v-if="line.product.isDigital">دیجیتال</span>
                        <span v-else>فیزیکی</span>
                      </div>

                      <div v-if="line.itemId == null" class="mt-2 text-[11px] text-warning/80">
                        شناسه آیتم سبد موجود نیست؛ ابتدا سبد از سرور sync می‌شود.
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pt-4 flex items-center justify-start">
                  <button
                      type="button"
                      class="btn btn-primary rounded-2xl"
                      :class="cart.items.length ? '' : 'btn-disabled'"
                      @click="nextStep()"
                      :disabled="savingProfile || syncingCart || busyAny"
                  >
                    ادامه
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- STEP 2: Info -->
          <section v-else-if="step === 2" key="s2" class="space-y-4">
            <div class="card bg-base-100 border border-base-300 shadow-sm">
              <div class="card-body">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-extrabold">اطلاعات تماس</h2>
                </div>

                <div class="grid md:grid-cols-2 gap-3 mt-4">
                  <label class="form-control">
                    <span class="label-text">نام و نام خانوادگی</span>
                    <input v-model="form.fullName" class="input input-bordered rounded-2xl" placeholder="مثال: علی رضایی" :disabled="savingProfile" />
                  </label>

                  <label class="form-control">
                    <span class="label-text">ایمیل</span>
                    <input v-model="form.email" class="input input-bordered rounded-2xl" type="email" placeholder="name@email.com" :disabled="savingProfile" />
                  </label>

                  <label class="form-control">
                    <span class="label-text">تلفن</span>
                    <input v-model="form.phone" class="input input-bordered rounded-2xl" type="tel" placeholder="09xxxxxxxxx" :disabled="savingProfile" />
                  </label>

                  <label class="form-control">
                    <span class="label-text">کد ملی (اختیاری)</span>
                    <input v-model="form.nationalId" class="input input-bordered rounded-2xl" placeholder="123xxxxxxx" :disabled="savingProfile" />
                  </label>
                </div>

                <div class="mt-3">
                  <label class="form-control">
                    <span class="label-text">یادداشت سفارش (اختیاری)</span>
                    <textarea
                        v-model="form.note"
                        class="textarea textarea-bordered rounded-2xl"
                        rows="3"
                        placeholder="توضیحات..."
                        :disabled="savingProfile"
                    />
                  </label>
                </div>

                <div class="mt-5 flex items-center justify-between gap-3">
                  <button
                      type="button"
                      class="btn btn-primary rounded-2xl order-1"
                      :class="canGoToPayment ? '' : 'btn-disabled'"
                      @click="nextStep()"
                      :disabled="!canGoToPayment || savingProfile"
                  >
                    <span v-if="!savingProfile">ادامه پرداخت</span>
                    <span v-else class="loading loading-spinner loading-sm"></span>
                  </button>

                  <button type="button" class="btn btn-ghost rounded-2xl order-2" @click="prevStep()" :disabled="savingProfile">
                    بازگشت
                  </button>
                </div>

                <p v-if="!canGoToPayment" class="text-xs text-base-content/60 mt-2">
                  لطفاً اطلاعات ضروری را کامل کنید.
                </p>
              </div>
            </div>
          </section>

          <!-- STEP 3: Payment -->
          <section v-else key="s3" class="space-y-4">
            <div class="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
              <div class="card-body">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-extrabold">پرداخت</h2>
                </div>

                <div class="mt-4 grid md:grid-cols-2 gap-3">
                  <button
                      type="button"
                      class="payPick"
                      :class="form.paymentMethod === 'online' ? 'payPick--active' : ''"
                      @click="form.paymentMethod='online'"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex items-start gap-3">
                        <div class="payPick__icon" aria-hidden="true">💳</div>
                        <div class="text-right">
                          <div class="font-semibold">درگاه آنلاین</div>
                          <div class="text-xs text-base-content/60 mt-1">پرداخت فوری با کارت بانکی</div>
                        </div>
                      </div>
                      <div class="payPick__dot" :class="form.paymentMethod==='online' ? 'payPick__dot--on' : ''"></div>
                    </div>
                  </button>

                  <button
                      type="button"
                      class="payPick"
                      :class="[form.paymentMethod === 'cod' ? 'payPick--active' : '', allDigital ? 'payPick--disabled' : '']"
                      @click="allDigital ? null : (form.paymentMethod='cod')"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex items-start gap-3">
                        <div class="payPick__icon" aria-hidden="true">📦</div>
                        <div class="text-right">
                          <div class="font-semibold">پرداخت در محل</div>
                          <div class="text-xs text-base-content/60 mt-1">مخصوص سفارش‌های فیزیکی</div>
                        </div>
                      </div>
                      <div class="payPick__dot" :class="form.paymentMethod==='cod' ? 'payPick__dot--on' : ''"></div>
                    </div>

                    <div class="mt-3 text-xs" :class="allDigital ? 'text-error/80' : 'text-base-content/60'">
                      <span v-if="allDigital">برای محصولات دیجیتال فعال نیست.</span>
                      <span v-else>مبلغ هنگام تحویل دریافت می‌شود.</span>
                    </div>
                  </button>
                </div>

                <label class="mt-4 flex items-center gap-2 cursor-pointer select-none">
                  <input v-model="form.acceptTerms" type="checkbox" class="checkbox checkbox-primary" />
                  <span class="text-sm">قوانین و شرایط خرید را می‌پذیرم.</span>
                </label>

                <div class="mt-5 flex items-center justify-between gap-3">
                  <button
                      type="button"
                      class="btn btn-primary rounded-2xl"
                      :class="canSubmit ? '' : 'btn-disabled'"
                      @click="placeOrder"
                  >
                    پرداخت و ثبت سفارش
                  </button>

                  <button type="button" class="btn btn-ghost rounded-2xl" @click="prevStep()">
                    بازگشت
                  </button>
                </div>

                <p v-if="!canSubmit" class="text-xs text-base-content/60 mt-2">
                  برای ادامه، اطلاعات ضروری را کامل کنید و قوانین را بپذیرید.
                </p>
              </div>
            </div>
          </section>
        </transition>
      </div>

      <!-- RIGHT -->
      <aside class="lg:sticky lg:top-6 h-fit">
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-extrabold">خلاصه سفارش</h2>
              <span class="badge badge-ghost rounded-xl">{{ cart.items.length }} آیتم</span>
            </div>

            <div class="mt-4 space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-base-content/70">جمع کالاها</span>
                <strong>{{ price(cartTotal) }}</strong>
              </div>

              <div class="divider my-2"></div>

              <div class="flex items-center justify-between">
                <span class="font-bold">مبلغ قابل پرداخت</span>
                <strong class="text-lg">{{ price(payable) }}</strong>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-2">
              <button type="button" class="btn btn-ghost rounded-2xl border border-base-200" @click="goTo(1)" :disabled="savingProfile">
                مشاهده سبد
              </button>

              <RouterLink to="/" class="btn btn-primary rounded-2xl">
                رفتن به فروشگاه
              </RouterLink>
            </div>

            <div v-if="allDigital && canSubmit" class="summary-note mt-4">
              تحویل آیتم‌های دیجیتال از طریق ایمیل/پنل پس از پرداخت انجام می‌شود.
            </div>

            <p v-if="cart.items.length === 0" class="text-xs text-base-content/60 mt-3">
              سبد خرید خالی است.
            </p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, watch, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import type { Product } from '@/services/types'
import { formatToman } from '@/services/currency'
import { getMe, updateMe } from '@/services/user'
import QuantityInput from '@/components/QuantityInput.vue'
import { useRouter } from 'vue-router'
import { getProduct } from '@/services/products'

// ✅ cart api clients
import { getCart, clearCart, removeCartItem, updateCartItemQty } from '@/services/cart'
import type { UpdateCartItemQtyPayload } from '@/types/api_client_types/cart.dto'

const router = useRouter()
const cart = useCartStore()
const auth = useAuthStore()
const toast = useToast()

const price = (n: number) => formatToman(n)

const step = ref<1 | 2 | 3>(1)
const savingProfile = ref(false)

const serverUserSnap = ref<any>(null)

/** -----------------------------
 * ✅ Cart sync state
 * ----------------------------- */
const syncingCart = ref(false)
const updatingId = ref<number | null>(null)
const removingId = ref<number | null>(null)
const clearing = ref(false)

const busyAny = computed(() => syncingCart.value || updatingId.value != null || removingId.value != null || clearing.value)

/** -----------------------------
 * ✅ Cart products via API
 * ----------------------------- */
type ProductVM = Product & {
  image?: string
  isDigital?: boolean
  compareAt?: number
  price?: number
  title?: string
}

const productsById = ref<Record<number, ProductVM>>({})
const loadingProducts = ref(false)

function normalizeImageUrl(u?: string | null) {
  const s = String(u ?? '').trim()
  if (!s) return ''
  if (/^https?:\/\//i.test(s)) return s
  if (s.startsWith('/')) return s
  return ''
}

function normalizeProduct(dto: any): ProductVM {
  const raw = dto?.data ?? dto?.product ?? dto
  return {
    ...(raw as any),
    id: raw?.id,
    title: raw?.title ?? 'بدون عنوان',
    price: Number(raw?.price ?? 0),
    compareAt: raw?.compare_at_price ?? raw?.compareAt,
    image: normalizeImageUrl(raw?.image_url || raw?.image) || '',
    isDigital: raw?.is_digital ?? raw?.isDigital ?? false
  }
}

function getProductIdFromCartItem(it: any): number | null {
  const pid = it?.product_id ?? it?.productId ?? it?.productID
  const n = Number(pid)
  return Number.isFinite(n) && n > 0 ? n : null
}

async function ensureCartProductsLoaded() {
  const numericIds = (cart.items || [])
      .map((x: any) => getProductIdFromCartItem(x))
      .filter((n: any): n is number => Number.isFinite(n))

  const missing = numericIds.filter((id) => !productsById.value[id])
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
    toast.error('خطا در دریافت اطلاعات محصولات سبد خرید')
  } finally {
    loadingProducts.value = false
  }
}

watch(
    () => cart.items,
    () => void ensureCartProductsLoaded(),
    { deep: true, immediate: true }
)

/** -----------------------------
 * ✅ detailed (server-cart based)
 * ----------------------------- */
const detailed = computed(() => {
  const items = cart.items || []
  return items.map((it: any) => {
    const itemId = Number(it?.id) || null
    const productId = getProductIdFromCartItem(it)
    const productKey = String(productId ?? it?.product_id ?? it?.productId ?? '') || String(itemId ?? Math.random())

    const qty = Number(it?.quantity ?? it?.qty ?? 1) || 1

    const product =
        productId != null && productsById.value[productId]
            ? productsById.value[productId]
            : ({
              id: productId ?? 0,
              title: it?.title ?? 'در حال دریافت...',
              price: Number(it?.unit_price ?? 0),
              image: '',
              isDigital: false
            } as any)

    const unitPrice =
        Number.isFinite(Number(it?.unit_price)) ? Number(it.unit_price) : Number((product as any).price ?? 0) || 0

    const lineTotal =
        Number.isFinite(Number(it?.line_total)) ? Number(it.line_total) : unitPrice * qty

    return { itemId, productKey, productId, qty, product, unitPrice, lineTotal }
  })
})

const cartTotal = computed(() => detailed.value.reduce((sum, l) => sum + (l.lineTotal || 0), 0))

const allDigital = computed(() => {
  if (!detailed.value.length) return true
  return detailed.value.every((l) => !!(l.product as any)?.isDigital)
})

/** -----------------------------
 * ✅ API: sync cart when step 1 opens
 * ----------------------------- */
async function syncCartFromServer() {
  if (!auth.token) return
  syncingCart.value = true
  try {
    const res = await getCart()
    cart.setCart(res)
  } catch (e: any) {
    console.error(e)
    toast.error(e?.response?.data?.error || e?.message || 'خطا در دریافت سبد خرید')
  } finally {
    syncingCart.value = false
  }
}

watch(
    () => step.value,
    (s) => {
      if (s === 1) void syncCartFromServer()
    },
    { immediate: true }
)

/** -----------------------------
 * ✅ API: update qty / remove / clear
 * ----------------------------- */
function clampQty(v: any) {
  const n = Number(v)
  if (!Number.isFinite(n)) return 1
  // اجازه‌ی 0 برای حذف از طریق PATCH
  return Math.max(0, Math.floor(n))
}

async function updateQtyServer(line: { itemId: number | null }, newQty: number) {
  if (!auth.token) return

  const itemId = line.itemId
  if (!itemId) {
    // اگر آیتم id ندارد، یعنی state لوکال است -> یکبار sync کن
    await syncCartFromServer()
    return
  }

  const qty = clampQty(newQty)

  // جلوگیری از چند درخواست همزمان برای یک آیتم
  if (updatingId.value === itemId) return

  updatingId.value = itemId
  try {
    const payload: UpdateCartItemQtyPayload = { quantity: qty }
    const res = await updateCartItemQty(itemId, payload)
    cart.setCart(res)
  } catch (e: any) {
    console.error(e)
    toast.error(e?.response?.data?.error || e?.message || 'خطا در بروزرسانی تعداد')
    // برای اینکه UI خراب نشه
    await syncCartFromServer()
  } finally {
    updatingId.value = null
  }
}

async function removeLineServer(line: { itemId: number | null }) {
  if (!auth.token) return

  const itemId = line.itemId
  if (!itemId) {
    await syncCartFromServer()
    return
  }

  if (removingId.value === itemId) return

  removingId.value = itemId
  try {
    const res = await removeCartItem(itemId)
    cart.setCart(res)
  } catch (e: any) {
    console.error(e)
    toast.error(e?.response?.data?.error || e?.message || 'خطا در حذف آیتم')
    await syncCartFromServer()
  } finally {
    removingId.value = null
  }
}

async function clearAllServer() {
  if (!auth.token) return
  clearing.value = true
  try {
    const res = await clearCart()
    cart.setCart(res)
    step.value = 1
  } catch (e: any) {
    console.error(e)
    toast.error(e?.response?.data?.error || e?.message || 'خطا در خالی کردن سبد')
    await syncCartFromServer()
  } finally {
    clearing.value = false
  }
}

/** -----------------------------
 * form (بدون ارسال فیزیکی)
 * ----------------------------- */
const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  nationalId: '',
  note: '',
  paymentMethod: 'online' as 'online' | 'cod',
  acceptTerms: false
})

function normalize(v: any) { return String(v ?? '').trim() }
function isBlank(v: any) { return !normalize(v) }

function splitFullName(fullName: string) {
  const parts = normalize(fullName).split(/\s+/).filter(Boolean)
  if (!parts.length) return { name: '', last_name: '' }
  const name = parts[0] ?? ''
  const last_name = parts.slice(1).join(' ')
  return { name, last_name }
}

function readNationalId(u: any) {
  return normalize(u?.nationalId ?? u?.national_id ?? u?.national_code ?? u?.nationalCode ?? '')
}

function fillFromAuthUser(u: any) {
  if (!u) return

  const name = normalize(u?.name)
  const last = normalize(u?.lastName ?? u?.last_name)
  const email = normalize(u?.email)
  const phone = normalize(u?.phone)
  const nationalId = readNationalId(u)

  if (isBlank(form.fullName)) form.fullName = [name, last].filter(Boolean).join(' ')
  if (isBlank(form.email)) form.email = email
  if (isBlank(form.phone)) form.phone = phone
  if (isBlank(form.nationalId)) form.nationalId = nationalId

  serverUserSnap.value = { name, last, email, phone, nationalId }
}

watch(
    () => auth.user,
    (u) => { if (u) fillFromAuthUser(u) },
    { immediate: true }
)

const payable = computed(() => Math.max(0, cartTotal.value))

const step1Ok = computed(() => cart.items.length > 0)

const step2Ok = computed(() => {
  if (!form.fullName.trim()) return false
  if (!form.phone.trim()) return false
  if (!form.email.trim()) return false
  return true
})

const canGoToPayment = computed(() => step1Ok.value && step2Ok.value)

const canSubmit = computed(() => {
  if (!step1Ok.value) return false
  if (!step2Ok.value) return false
  if (!form.acceptTerms) return false
  if (allDigital.value && form.paymentMethod === 'cod') return false
  return true
})

function buildFillMissingPayload(): Record<string, any> {
  const snap = serverUserSnap.value
  if (!snap) return {}

  const { name, last_name } = splitFullName(form.fullName)
  const payload: Record<string, any> = {}

  if (isBlank(snap.name) && !isBlank(name)) payload.name = normalize(name)
  if (isBlank(snap.last) && !isBlank(last_name)) payload.last_name = normalize(last_name)
  if (isBlank(snap.email) && !isBlank(form.email)) payload.email = normalize(form.email)
  if (isBlank(snap.phone) && !isBlank(form.phone)) payload.phone = normalize(form.phone)
  if (isBlank(snap.nationalId) && !isBlank(form.nationalId)) payload.national_id = normalize(form.nationalId)

  return payload
}

async function syncProfileFillMissing() {
  if (!auth.user) return
  const payload = buildFillMissingPayload()
  if (!Object.keys(payload).length) return

  savingProfile.value = true
  try {
    const res = await updateMe(payload as any)
    const newUser = res?.user ?? res
    if (newUser) {
      ;(auth as any).user = newUser
      localStorage.setItem('auth_user', JSON.stringify(newUser))
      fillFromAuthUser(newUser)
    }
    toast.success('اطلاعات خالی پروفایل تکمیل شد')
  } catch (e: any) {
    toast.error(e?.response?.data?.error || e?.message || 'خطا در تکمیل اطلاعات پروفایل')
    throw e
  } finally {
    savingProfile.value = false
  }
}

async function goTo(s: 1 | 2 | 3) {
  if (savingProfile.value) return

  if (s === 1) { step.value = 1; return }
  if (s === 2) {
    if (!step1Ok.value) return
    step.value = 2
    if (auth.user) fillFromAuthUser(auth.user)
    return
  }
  if (s === 3) {
    if (!canGoToPayment.value) return
    try {
      await syncProfileFillMissing()
      step.value = 3
    } catch {}
  }
}

async function nextStep() {
  if (savingProfile.value) return

  if (step.value === 1 && step1Ok.value) {
    step.value = 2
    if (auth.user) fillFromAuthUser(auth.user)
    return
  }

  if (step.value === 2 && step2Ok.value) {
    try {
      await syncProfileFillMissing()
      step.value = 3
    } catch {}
  }
}

function prevStep() {
  if (savingProfile.value) return
  if (step.value === 3) step.value = 2
  else if (step.value === 2) step.value = 1
}

function placeOrder() {
  if (!canSubmit.value) return
  alert('این یک دموی فرانت‌اند است. پرداخت واقعی متصل نشده است.')
}

/** ✅ فقط برای fallback لوکال (الان بیشتر از سرور استفاده می‌کنیم) */
const clearAll = () => {
  ;(cart as any).clear?.()
  ;(cart as any).clearCart?.()
  ;(cart as any).reset?.()
  step.value = 1
}

const loadingMe = ref(false)
const DEV_BYPASS_AUTH = import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'false'

async function fetchMeOnLoad() {
  if (DEV_BYPASS_AUTH) return
  loadingMe.value = true
  try {
    const me = await getMe()
    ;(auth as any).user = me
    localStorage.setItem('auth_user', JSON.stringify(me))
    fillFromAuthUser(me)
  } catch (err: any) {
    if (err?.response?.data?.error?.message === 'Invalid token') {
      router.push('/login')
      return
    }
    toast.error(err?.response?.data?.error || err?.message || 'خطا در دریافت اطلاعات کاربر')
  } finally {
    loadingMe.value = false
  }
}

onMounted(() => {
  void fetchMeOnLoad()
  // اگر صفحه مستقیم روی step=1 میاد، همینجا هم sync کن
  if (step.value === 1) void syncCartFromServer()
})
</script>

<style scoped>
.stepper{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.stepper__line{ height:2px; width:96px; border-radius:999px; background:rgba(0,0,0,.10); }
@media (min-width: 768px){ .stepper__line{ width:140px; } }
.stepper__line--on{ background:rgba(99,102,241,.55); }
.step{
  display:inline-flex; align-items:center; gap:10px; padding:10px 12px; border-radius:9999px;
  border:1px solid rgba(0,0,0,.10); background:rgba(255,255,255,.85);
  transition: transform .12s ease, border-color .12s ease, box-shadow .12s ease, opacity .12s ease;
}
.step:disabled{ opacity:.55; cursor:not-allowed; }
.step:hover:not(:disabled){ transform: translateY(-1px); border-color: rgba(0,0,0,.16); box-shadow: 0 12px 26px rgba(15,23,42,.06); }
.step__num{ width:30px; height:30px; border-radius:9999px; display:grid; place-items:center; font-weight:800; font-size:12px; background:rgba(0,0,0,.06); color:rgba(0,0,0,.72); }
.step__text{ font-size:13px; font-weight:700; color:rgba(0,0,0,.70); }
.step--active{ border-color: rgba(99,102,241,.55); background: linear-gradient(135deg, rgba(99,102,241,.10), rgba(255,255,255,.92)); }
.step--active .step__num{ background: rgba(99,102,241,.95); color:white; }
.step--active .step__text{ color: rgba(17,24,39,.92); }
.step--done{ border-color: rgba(99,102,241,.35); }
.step--done .step__num{ background: rgba(99,102,241,.12); color: rgba(55,65,81,.92); }

.icon-btn{
  width:34px; height:34px; border-radius:12px; border:1px solid rgba(0,0,0,.08);
  background:transparent; display:grid; place-items:center; opacity:.9;
  transition: transform .12s ease, border-color .12s ease, opacity .12s ease;
}
.icon-btn:hover{ transform: translateY(-1px); opacity:1; border-color: rgba(239,68,68,.30); }

.qty-wrap{
  border: 1px solid rgba(0,0,0,.10);
  border-radius: 14px;
  padding: 6px 8px;
  background: rgba(255,255,255,.9);
  max-width: 160px;
}

.payPick{
  text-align:right; border-radius:24px; border:1px solid rgba(0,0,0,.10);
  background:rgba(255,255,255,.9); padding:14px;
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease, background .12s ease;
  position:relative; overflow:hidden;
}
.payPick:hover{ transform: translateY(-1px); box-shadow: 0 14px 30px rgba(0,0,0,.08); border-color: rgba(0,0,0,.18); }
.payPick--active{
  border-color: rgba(99,102,241,.55);
  background: linear-gradient(135deg, rgba(99,102,241,.10), rgba(255,255,255,.92));
  box-shadow: 0 18px 40px rgba(99,102,241,.12);
}
.payPick--disabled{ opacity:.55; pointer-events:none; filter: grayscale(.2); }

.payPick__icon{
  width:44px; height:44px; border-radius:18px; border:1px solid rgba(0,0,0,.10);
  background: rgba(255,255,255,.95); display:flex; align-items:center; justify-content:center;
  font-size:20px;
}
.payPick__dot{
  width:16px; height:16px; border-radius:999px; border:2px solid rgba(0,0,0,.18);
  margin-top:2px; flex:0 0 auto;
}
.payPick__dot--on{
  border-color: rgba(99,102,241,.9);
  box-shadow: inset 0 0 0 4px rgba(99,102,241,.9);
}

.summary-note{
  border: 1px solid rgba(99,102,241,.18);
  background: rgba(99,102,241,.06);
  border-radius: 18px;
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.7;
  color: rgba(17,24,39,.82);
}

.fade-slide-enter-active,
.fade-slide-leave-active{ transition: opacity 180ms ease, transform 180ms ease; }
.fade-slide-enter-from,
.fade-slide-leave-to{ opacity: 0; transform: translateY(6px); }
</style>
