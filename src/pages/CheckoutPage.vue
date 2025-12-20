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
          :disabled="cart.items.length === 0"
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
          :disabled="!canGoToPayment"
      >
        <span class="step__num">3</span>
        <span class="step__text">پرداخت</span>
      </button>
    </div>

    <!-- Layout -->
    <div class="grid lg:grid-cols-[1fr,380px] gap-6">
      <!-- LEFT: Step content -->
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
                    @click="clearAll()"
                >
                  خالی کردن سبد
                </button>
              </div>

              <!-- Empty -->
              <div v-if="cart.items.length === 0" class="mt-4 rounded-3xl border border-base-200 p-4">
                <div class="text-sm font-semibold">سبد خرید خالی است</div>
                <div class="text-xs text-base-content/60 mt-1">
                  برای ادامه، حداقل یک محصول اضافه کنید.
                </div>

                <RouterLink to="/" class="btn btn-primary rounded-2xl mt-4">
                  رفتن به فروشگاه
                </RouterLink>
              </div>

              <!-- Items -->
              <div v-else class="mt-4 divide-y divide-base-200">
                <div v-for="line in cart.detailed" :key="line.productId" class="py-4">
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
                            {{ price(line.product.price) }}
                            <span class="opacity-60"> / واحد</span>
                          </div>
                        </div>

                        <button
                            type="button"
                            class="icon-btn"
                            @click="cart.remove(line.productId)"
                            aria-label="remove"
                            title="حذف"
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

                      <div class="mt-3 flex items-end justify-between gap-3">
                        <div class="qty-wrap">
                          <QuantityInput
                              v-model="(line as any).qty"
                              @update:model-value="cart.setQty(line.productId, $event)"
                          />
                        </div>

                        <div class="text-left">
                          <div class="text-[10px] text-base-content/50">جمع</div>
                          <div class="text-sm font-semibold whitespace-nowrap">
                            {{ price(line.lineTotal) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ✅ Step actions (ادامه سمت چپ) -->
                <div class="pt-4 flex items-center justify-start">
                  <button
                      type="button"
                      class="btn btn-primary rounded-2xl"
                      :class="cart.items.length ? '' : 'btn-disabled'"
                      @click="nextStep()"
                  >
                    ادامه
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- STEP 2: Info -->
          <section v-else-if="step === 2" key="s2" class="space-y-4">
            <!-- Contact -->
            <div class="card bg-base-100 border border-base-300 shadow-sm">
              <div class="card-body">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-extrabold">اطلاعات تماس</h2>
                </div>

                <div class="grid md:grid-cols-2 gap-3 mt-4">
                  <label class="form-control">
                    <span class="label-text">نام و نام خانوادگی</span>
                    <input v-model="form.fullName" class="input input-bordered rounded-2xl" placeholder="مثال: علی رضایی" />
                  </label>

                  <label class="form-control">
                    <span class="label-text">ایمیل</span>
                    <input v-model="form.email" class="input input-bordered rounded-2xl" type="email" placeholder="name@email.com" />
                  </label>

                  <label class="form-control">
                    <span class="label-text">تلفن</span>
                    <input v-model="form.phone" class="input input-bordered rounded-2xl" type="tel" placeholder="09xxxxxxxxx" />
                  </label>

                  <label class="form-control">
                    <span class="label-text">کد ملی (اختیاری)</span>
                    <input v-model="form.nationalId" class="input input-bordered rounded-2xl" placeholder="123xxxxxxx" />
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
                    />
                  </label>
                </div>

                <!-- Actions -->
                <div class="mt-5 flex items-center justify-between gap-3">
                  <button
                      type="button"
                      class="btn btn-primary rounded-2xl order-1"
                      :class="canGoToPayment ? '' : 'btn-disabled'"
                      @click="nextStep()"
                  >
                    ادامه پرداخت
                  </button>

                  <button type="button" class="btn btn-ghost rounded-2xl order-2" @click="prevStep()">
                    بازگشت
                  </button>
                </div>

                <p v-if="!canGoToPayment" class="text-xs text-base-content/60 mt-2">
                  لطفاً اطلاعات ضروری را کامل کنید.
                </p>
              </div>
            </div>

            <!-- Shipping -->
            <div class="card bg-base-100 border border-base-300 shadow-sm" v-if="hasPhysical">
              <div class="card-body">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-extrabold">آدرس ارسال</h2>
                </div>

                <div class="grid md:grid-cols-2 gap-3 mt-4">
                  <label class="form-control">
                    <span class="label-text">استان</span>
                    <input v-model="form.state" class="input input-bordered rounded-2xl" placeholder="مثال: تهران" />
                  </label>

                  <label class="form-control">
                    <span class="label-text">شهر</span>
                    <input v-model="form.city" class="input input-bordered rounded-2xl" placeholder="مثال: تهران" />
                  </label>

                  <label class="form-control">
                    <span class="label-text">کد پستی</span>
                    <input v-model="form.postalCode" class="input input-bordered rounded-2xl" placeholder="10 رقمی" />
                  </label>

                  <label class="form-control">
                    <span class="label-text">پلاک / واحد</span>
                    <input v-model="form.unit" class="input input-bordered rounded-2xl" placeholder="پلاک 12، واحد 3" />
                  </label>
                </div>

                <div class="mt-3">
                  <label class="form-control">
                    <span class="label-text">آدرس کامل</span>
                    <textarea
                        v-model="form.address"
                        class="textarea textarea-bordered rounded-2xl"
                        rows="3"
                        placeholder="خیابان... کوچه... پلاک..."
                    />
                  </label>
                </div>

                <div class="mt-4 grid md:grid-cols-2 gap-3">
                  <div class="rounded-3xl border border-base-200 p-4 bg-base-200/20">
                    <div class="font-semibold mb-2">روش ارسال</div>
                    <div class="join w-full">
                      <button
                          type="button"
                          class="btn join-item rounded-2xl"
                          :class="form.shippingMethod==='standard' ? 'btn-primary' : 'btn-ghost'"
                          @click="form.shippingMethod='standard'"
                      >
                        عادی
                      </button>
                      <button
                          type="button"
                          class="btn join-item rounded-2xl"
                          :class="form.shippingMethod==='express' ? 'btn-primary' : 'btn-ghost'"
                          @click="form.shippingMethod='express'"
                      >
                        سریع
                      </button>
                    </div>
                    <div class="text-xs text-base-content/60 mt-2">
                      هزینه ارسال در جمع کل محاسبه می‌شود.
                    </div>
                  </div>

                  <div class="rounded-3xl border border-base-200 p-4 bg-base-200/20">
                    <div class="font-semibold mb-2">زمان تحویل</div>
                    <select v-model="form.deliveryWindow" class="select select-bordered rounded-2xl w-full">
                      <option value="any">فرقی ندارد</option>
                      <option value="morning">صبح (۹ تا ۱۳)</option>
                      <option value="evening">عصر (۱۳ تا ۱۸)</option>
                    </select>
                    <div class="text-xs text-base-content/60 mt-2">
                      در صورت امکان هماهنگ می‌شود.
                    </div>
                  </div>
                </div>
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
                  <!-- ONLINE (emoji) -->
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

                  <!-- COD (emoji) -->
                  <button
                      type="button"
                      class="payPick"
                      :class="[
                      form.paymentMethod === 'cod' ? 'payPick--active' : '',
                      allDigital ? 'payPick--disabled' : ''
                    ]"
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

                <!-- Coupon -->
                <div class="mt-4 collapse collapse-arrow border border-base-200 rounded-3xl bg-base-100">
                  <input type="checkbox" />
                  <div class="collapse-title font-semibold flex items-center gap-2">
                    کد تخفیف
                    <span class="text-xs text-base-content/50 font-normal">اختیاری</span>
                  </div>
                  <div class="collapse-content">
                    <div class="join w-full mt-2">
                      <input
                          v-model="form.coupon"
                          class="input input-bordered join-item rounded-2xl w-full"
                          placeholder="مثال: OFF10"
                      />
                      <button type="button" class="btn btn-primary join-item rounded-2xl" @click="applyCoupon">
                        اعمال
                      </button>
                    </div>
                    <div v-if="couponMsg" class="mt-2 text-xs text-base-content/70">
                      {{ couponMsg }}
                    </div>
                  </div>
                </div>

                <!-- Terms -->
                <label class="mt-4 flex items-center gap-2 cursor-pointer select-none">
                  <input v-model="form.acceptTerms" type="checkbox" class="checkbox checkbox-primary" />
                  <span class="text-sm">قوانین و شرایط خرید را می‌پذیرم.</span>
                </label>

                <!-- Actions swapped -->
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

                <!-- ✅ پیام دیجیتال از اینجا حذف شد -->
              </div>
            </div>
          </section>
        </transition>
      </div>

      <!-- RIGHT: Summary -->
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
                <strong>{{ price(cart.total) }}</strong>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-base-content/70">هزینه ارسال</span>
                <strong>{{ price(shippingCost) }}</strong>
              </div>

              <div class="flex items-center justify-between" v-if="discountAmount > 0">
                <span class="text-base-content/70">تخفیف</span>
                <strong class="text-error">- {{ price(discountAmount) }}</strong>
              </div>

              <div class="divider my-2"></div>

              <div class="flex items-center justify-between">
                <span class="font-bold">مبلغ قابل پرداخت</span>
                <strong class="text-lg">{{ price(payable) }}</strong>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-2">
              <button
                  type="button"
                  class="btn btn-ghost rounded-2xl border border-base-200"
                  @click="goTo(1)"
              >
                مشاهده سبد
              </button>

              <RouterLink to="/" class="btn btn-primary rounded-2xl">
                رفتن به فروشگاه
              </RouterLink>
            </div>

            <!-- ✅ پیام دیجیتال: پایین همه اطلاعات (در خلاصه سفارش) -->
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
import { reactive, computed, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/services/types'
import { formatToman } from '@/services/currency'
import QuantityInput from '@/components/QuantityInput.vue'

const cart = useCartStore()
const price = (n: number) => formatToman(n)

const step = ref<1 | 2 | 3>(1)

const allDigital = computed(() => cart.detailed.every(l => (l.product as Product).isDigital))
const hasPhysical = computed(() => !allDigital.value)

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  nationalId: '',
  note: '',

  state: '',
  city: '',
  postalCode: '',
  unit: '',
  address: '',
  shippingMethod: 'standard' as 'standard' | 'express',
  deliveryWindow: 'any' as 'any' | 'morning' | 'evening',

  paymentMethod: 'online' as 'online' | 'cod',
  coupon: '',
  acceptTerms: false,
})

const couponMsg = ref('')
const discountAmount = ref(0)

const shippingCost = computed(() => {
  if (!hasPhysical.value) return 0
  return form.shippingMethod === 'express' ? 75000 : 35000
})

const payable = computed(() => Math.max(0, cart.total + shippingCost.value - discountAmount.value))

const step1Ok = computed(() => cart.items.length > 0)

const step2Ok = computed(() => {
  if (!form.fullName.trim()) return false
  if (!form.phone.trim()) return false
  if (!form.email.trim()) return false

  if (hasPhysical.value) {
    if (!form.state.trim()) return false
    if (!form.city.trim()) return false
    if (!form.postalCode.trim()) return false
    if (!form.address.trim()) return false
  }
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

function goTo(s: 1 | 2 | 3) {
  if (s === 1) {
    step.value = 1
    return
  }
  if (s === 2) {
    if (!step1Ok.value) return
    step.value = 2
    return
  }
  if (s === 3) {
    if (!canGoToPayment.value) return
    step.value = 3
  }
}

function nextStep() {
  if (step.value === 1 && step1Ok.value) step.value = 2
  else if (step.value === 2 && step2Ok.value) step.value = 3
}

function prevStep() {
  if (step.value === 3) step.value = 2
  else if (step.value === 2) step.value = 1
}

function applyCoupon() {
  const code = form.coupon.trim().toUpperCase()
  if (!code) {
    couponMsg.value = 'کدی وارد نشده.'
    discountAmount.value = 0
    return
  }
  if (code === 'OFF10') {
    discountAmount.value = Math.min(Math.floor(cart.total * 0.1), 200000)
    couponMsg.value = 'کد تخفیف اعمال شد.'
    return
  }
  couponMsg.value = 'کد معتبر نیست.'
  discountAmount.value = 0
}

function placeOrder() {
  if (!canSubmit.value) return
  alert('این یک دموی فرانت‌اند است. پرداخت واقعی متصل نشده است.')
}

const clearAll = () => {
  ;(cart as any).clear?.()
  ;(cart as any).clearCart?.()
  ;(cart as any).reset?.()
  step.value = 1
}
</script>

<style scoped>
/* stepper */
.stepper{
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.stepper__line{
  height: 2px;
  width: 96px;            /* ✅ طول بیشتر */
  border-radius: 999px;
  background: rgba(0,0,0,.10);
}
@media (min-width: 768px){
  .stepper__line{
    width: 140px;         /* ✅ دسکتاپ طول بیشتر */
  }
}
.stepper__line--on{
  background: rgba(99,102,241,.55);
}
.step{
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 9999px;
  border: 1px solid rgba(0,0,0,.10);
  background: rgba(255,255,255,.85);
  transition: transform .12s ease, border-color .12s ease, box-shadow .12s ease, opacity .12s ease;
}
.step:disabled{
  opacity: .55;
  cursor: not-allowed;
}
.step:hover:not(:disabled){
  transform: translateY(-1px);
  border-color: rgba(0,0,0,.16);
  box-shadow: 0 12px 26px rgba(15,23,42,.06);
}
.step__num{
  width: 30px;
  height: 30px;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 12px;
  background: rgba(0,0,0,.06);
  color: rgba(0,0,0,.72);
}
.step__text{
  font-size: 13px;
  font-weight: 700;
  color: rgba(0,0,0,.70);
}
.step--active{
  border-color: rgba(99,102,241,.55);
  background: linear-gradient(135deg, rgba(99,102,241,.10), rgba(255,255,255,.92));
}
.step--active .step__num{
  background: rgba(99,102,241,.95);
  color: white;
}
.step--active .step__text{
  color: rgba(17,24,39,.92);
}
.step--done{
  border-color: rgba(99,102,241,.35);
}
.step--done .step__num{
  background: rgba(99,102,241,.12);
  color: rgba(55,65,81,.92);
}

/* minimal controls */
.icon-btn{
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,.08);
  background: transparent;
  display: grid;
  place-items: center;
  opacity: .9;
  transition: transform .12s ease, border-color .12s ease, opacity .12s ease;
}
.icon-btn:hover{
  transform: translateY(-1px);
  opacity: 1;
  border-color: rgba(239,68,68,.30);
}

.qty-wrap{
  border: 1px solid rgba(0,0,0,.10);
  border-radius: 14px;
  padding: 6px 8px;
  background: rgba(255,255,255,.9);
  max-width: 160px;
}

/* payment cards */
.payPick{
  text-align: right;
  border-radius: 24px;
  border: 1px solid rgba(0,0,0,.10);
  background: rgba(255,255,255,.9);
  padding: 14px;
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease, background .12s ease;
  position: relative;
  overflow: hidden;
}
.payPick:hover{
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(0,0,0,.08);
  border-color: rgba(0,0,0,.18);
}
.payPick--active{
  border-color: rgba(99,102,241,.55);
  background: linear-gradient(135deg, rgba(99,102,241,.10), rgba(255,255,255,.92));
  box-shadow: 0 18px 40px rgba(99,102,241,.12);
}
.payPick--disabled{
  opacity: .55;
  pointer-events: none;
  filter: grayscale(.2);
}

.payPick__icon{
  width: 44px;
  height: 44px;
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,.10);
  background: rgba(255,255,255,.95);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size: 20px;
}

.payPick__dot{
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid rgba(0,0,0,.18);
  margin-top: 2px;
  flex: 0 0 auto;
}
.payPick__dot--on{
  border-color: rgba(99,102,241,.9);
  box-shadow: inset 0 0 0 4px rgba(99,102,241,.9);
}

/* summary note (digital delivery text) */
.summary-note{
  border: 1px solid rgba(99,102,241,.18);
  background: rgba(99,102,241,.06);
  border-radius: 18px;
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.7;
  color: rgba(17,24,39,.82);
}

/* transitions */
.fade-slide-enter-active,
.fade-slide-leave-active{
  transition: opacity 180ms ease, transform 180ms ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to{
  opacity: 0;
  transform: translateY(6px);
}
</style>
