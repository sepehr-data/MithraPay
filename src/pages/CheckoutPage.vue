<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <!-- Header -->
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black">تسویه حساب</h1>
      </div>

      <div class="hidden md:flex items-center gap-2">
        <span class="badge badge-ghost rounded-2xl">پرداخت امن</span>
        <span class="badge badge-ghost rounded-2xl">پشتیبانی</span>
      </div>
    </div>

    <div class="grid lg:grid-cols-[1fr,420px] gap-6">
      <!-- LEFT: Forms -->
      <div class="space-y-4">
        <!-- Contact -->
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-extrabold">اطلاعات تماس</h2>
            </div>

            <div class="grid md:grid-cols-2 gap-3 mt-3">
              <label class="form-control">
                <span class="label-text">نام و نام خانوادگی</span>
                <input v-model="form.fullName" class="input input-bordered rounded-2xl" placeholder="علی رضایی" />
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
                    placeholder="مثلاً ساعت تحویل، توضیح خاص..."
                />
              </label>
            </div>
          </div>
        </div>

        <!-- Shipping -->
        <div class="card bg-base-100 border border-base-300 shadow-sm" v-if="hasPhysical">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-extrabold">آدرس ارسال</h2>
            </div>

            <div class="grid md:grid-cols-2 gap-3 mt-3">
              <label class="form-control">
                <span class="label-text">استان</span>
                <input v-model="form.state" class="input input-bordered rounded-2xl" placeholder="مثلاً تهران" />
              </label>

              <label class="form-control">
                <span class="label-text">شهر</span>
                <input v-model="form.city" class="input input-bordered rounded-2xl" placeholder="مثلاً تهران" />
              </label>

              <label class="form-control">
                <span class="label-text">کد پستی</span>
                <input v-model="form.postalCode" class="input input-bordered rounded-2xl" placeholder="10 رقمی" />
              </label>

              <label class="form-control">
                <span class="label-text">پلاک / واحد</span>
                <input v-model="form.unit" class="input input-bordered rounded-2xl" placeholder="پلاک ۱۲، واحد ۳" />
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
              <div class="rounded-3xl border border-base-200 p-4 bg-base-200/30">
                <div class="font-extrabold mb-2">روش ارسال</div>
                <div class="join w-full">
                  <button
                      class="btn join-item rounded-2xl"
                      :class="form.shippingMethod==='standard' ? 'btn-primary' : 'btn-ghost'"
                      @click="form.shippingMethod='standard'"
                  >
                    عادی
                  </button>
                  <button
                      class="btn join-item rounded-2xl"
                      :class="form.shippingMethod==='express' ? 'btn-primary' : 'btn-ghost'"
                      @click="form.shippingMethod='express'"
                  >
                    سریع
                  </button>
                </div>
                <div class="text-xs opacity-70 mt-2">هزینه ارسال در جمع کل محاسبه می‌شود.</div>
              </div>

              <div class="rounded-3xl border border-base-200 p-4 bg-base-200/30">
                <div class="font-extrabold mb-2">زمان تحویل</div>
                <select v-model="form.deliveryWindow" class="select select-bordered rounded-2xl w-full">
                  <option value="any">فرقی ندارد</option>
                  <option value="morning">صبح (۹ تا ۱۳)</option>
                  <option value="evening">عصر (۱۳ تا ۱۸)</option>
                </select>
                <div class="text-xs opacity-70 mt-2">در صورت امکان هماهنگ می‌شود.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment (NEW DESIGN) -->
        <div class="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-extrabold">پرداخت</h2>
            </div>

            <!-- method cards -->
            <div class="mt-4 grid md:grid-cols-2 gap-3">
              <!-- ONLINE -->
              <button
                  type="button"
                  class="payPick"
                  :class="form.paymentMethod === 'online' ? 'payPick--active' : ''"
                  @click="form.paymentMethod='online'"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-start gap-3">
                    <div class="payPick__icon">💳</div>
                    <div class="text-right">
                      <div class="font-extrabold">درگاه آنلاین</div>
                      <div class="text-xs opacity-70 mt-1">پرداخت فوری با کارت بانکی</div>
                    </div>
                  </div>

                  <div class="payPick__dot" :class="form.paymentMethod==='online' ? 'payPick__dot--on' : ''"></div>
                </div>

                <div class="mt-3 flex flex-wrap gap-2">
                  <span class="badge badge-ghost rounded-xl text-xs">سریع</span>
                  <span class="badge badge-ghost rounded-xl text-xs">امن</span>
                  <span class="badge badge-ghost rounded-xl text-xs">خودکار</span>
                </div>
              </button>

              <!-- COD -->
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
                    <div class="payPick__icon">📦</div>
                    <div class="text-right">
                      <div class="font-extrabold">پرداخت در محل</div>
                      <div class="text-xs opacity-70 mt-1">مخصوص سفارش‌های فیزیکی</div>
                    </div>
                  </div>

                  <div class="payPick__dot" :class="form.paymentMethod==='cod' ? 'payPick__dot--on' : ''"></div>
                </div>

                <div class="mt-3 text-xs" :class="allDigital ? 'text-error/80' : 'opacity-70'">
                  <span v-if="allDigital">برای محصولات دیجیتال فعال نیست.</span>
                  <span v-else>مبلغ هنگام تحویل دریافت می‌شود.</span>
                </div>
              </button>
            </div>


            <!-- Coupon (collapsible, cleaner) -->
            <div class="mt-4 collapse collapse-arrow border border-base-200 rounded-3xl bg-base-100">
              <input type="checkbox" />
              <div class="collapse-title font-extrabold flex items-center gap-2">
                🎁 کد تخفیف
                <span class="text-xs opacity-60 font-normal">اختیاری</span>
              </div>
              <div class="collapse-content">
                <div class="join w-full mt-2">
                  <input
                      v-model="form.coupon"
                      class="input input-bordered join-item rounded-2xl w-full"
                      placeholder="مثلاً OFF10"
                  />
                  <button class="btn btn-primary join-item rounded-2xl" @click="applyCoupon">
                    اعمال
                  </button>
                </div>
                <div v-if="couponMsg" class="mt-2 text-xs opacity-80">
                  {{ couponMsg }}
                </div>
              </div>
            </div>

            <!-- Terms -->
            <label class="mt-4 flex items-center gap-2 cursor-pointer select-none">
              <input v-model="form.acceptTerms" type="checkbox" class="checkbox checkbox-primary" />
              <span class="text-sm">
        قوانین و شرایط خرید را می‌پذیرم.
      </span>
            </label>
          </div>
        </div>

      </div>

      <!-- RIGHT: Order summary -->
      <div class="lg:sticky lg:top-6 h-fit">
        <div class="card bg-base-100 border border-base-300 shadow-sm">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-extrabold">سفارش شما</h2>
              <span class="badge badge-ghost rounded-xl">{{ cart.items.length }} آیتم</span>
            </div>

            <div class="mt-4 space-y-3">
              <div
                  v-for="line in cart.detailed"
                  :key="line.productId"
                  class="flex gap-3 p-3 rounded-3xl border border-base-200"
              >
                <img
                    :src="line.product.image || 'https://placehold.co/64x64'"
                    class="w-14 h-14 rounded-2xl object-cover border border-base-200"
                    alt=""
                />
                <div class="flex-1 min-w-0">
                  <div class="font-bold truncate">{{ line.product.title }}</div>
                  <div class="text-xs opacity-70 mt-1">
                    تعداد: {{ line.qty }} • {{ price(line.product.price) }} / واحد
                  </div>
                </div>
                <div class="text-left">
                  <div class="text-xs opacity-70">جمع</div>
                  <div class="font-extrabold">{{ price(line.lineTotal) }}</div>
                </div>
              </div>
            </div>

            <div class="divider my-4"></div>

            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span class="opacity-70">جمع کالاها</span>
                <strong>{{ price(cart.total) }}</strong>
              </div>

              <div class="flex items-center justify-between">
                <span class="opacity-70">هزینه ارسال</span>
                <strong>{{ price(shippingCost) }}</strong>
              </div>

              <div class="flex items-center justify-between" v-if="discountAmount > 0">
                <span class="opacity-70">تخفیف</span>
                <strong class="text-error">- {{ price(discountAmount) }}</strong>
              </div>

              <div class="divider my-2"></div>

              <div class="flex items-center justify-between">
                <span class="font-bold">مبلغ قابل پرداخت</span>
                <strong class="text-lg">{{ price(payable) }}</strong>
              </div>
            </div>

            <button
                class="btn btn-primary w-full rounded-2xl mt-4"
                :class="canSubmit ? '' : 'btn-disabled'"
                @click="placeOrder"
            >
              پرداخت و ثبت سفارش
            </button>

            <!-- ✅ Digital delivery message: only when form complete + accepted terms -->
            <div v-if="allDigital && canSubmit" class="alert alert-info mt-4 rounded-3xl">
              <span>📩</span>
              <span class="text-sm">
                تحویل آیتم‌های دیجیتال از طریق ایمیل/پنل پس از پرداخت انجام می‌شود.
              </span>
            </div>

            <p class="text-xs opacity-70 mt-2" v-if="!canSubmit">
              برای ادامه، اطلاعات ضروری را کامل کنید و قوانین را بپذیرید.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/services/types'
import { formatToman } from '@/services/currency'

const cart = useCartStore()
const price = (n: number) => formatToman(n)

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

const canSubmit = computed(() => {
  if (!form.fullName.trim()) return false
  if (!form.phone.trim()) return false
  if (!form.email.trim()) return false
  if (hasPhysical.value) {
    if (!form.state.trim()) return false
    if (!form.city.trim()) return false
    if (!form.postalCode.trim()) return false
    if (!form.address.trim()) return false
  }
  if (!form.acceptTerms) return false
  if (allDigital.value && form.paymentMethod === 'cod') return false
  return cart.items.length > 0
})

function applyCoupon() {
  const code = form.coupon.trim().toUpperCase()
  if (!code) {
    couponMsg.value = 'کدی وارد نشده.'
    discountAmount.value = 0
    return
  }
  if (code === 'OFF10') {
    discountAmount.value = Math.min(Math.floor(cart.total * 0.1), 200000)
    couponMsg.value = 'کد تخفیف اعمال شد ✅'
    return
  }
  couponMsg.value = 'کد معتبر نیست.'
  discountAmount.value = 0
}

function placeOrder() {
  if (!canSubmit.value) return
  alert('این یک دموی فرانت‌اند است. پرداخت واقعی متصل نشده است.')
}
</script>

<style scoped>
.pay-card{
  border-radius: 24px;
  border: 1px solid rgba(0,0,0,.10);
  background: rgba(255,255,255,.86);
  padding: 14px;
  text-align: right;
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
}
.pay-card:hover{
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(0,0,0,.08);
  border-color: rgba(0,0,0,.18);
}
.pay-card--active{
  border-color: rgba(99,102,241,.55);
  box-shadow: 0 18px 40px rgba(99,102,241,.18);
  background: linear-gradient(135deg, rgba(99,102,241,.12), rgba(236,72,153,.08));
}
.pay-card--disabled{
  opacity: .55;
  pointer-events: none;
  filter: grayscale(.2);
}
.pay-icon{
  width: 42px;
  height: 42px;
  border-radius: 18px;
  display:flex;
  align-items:center;
  justify-content:center;
  border: 1px solid rgba(0,0,0,.10);
  background: rgba(255,255,255,.9);
}

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
  background: linear-gradient(135deg, rgba(99,102,241,.10), rgba(236,72,153,.06));
  box-shadow: 0 18px 40px rgba(99,102,241,.14);
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

</style>
