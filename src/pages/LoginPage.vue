<template>
  <div
      class="min-h-screen flex items-center justify-center px-4 py-10"
      :style="{
      backgroundImage: `url(${authBg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',        // stretch to viewport
      backgroundPosition: 'left top',     // keep red on the left
    }"
  >
    <!-- overlay so text is readable -->
    <div class="absolute inset-0 bg-base-200/35"></div>

    <div
        class="relative w-full max-w-3xl bg-base-100/95 backdrop-blur-sm rounded-3xl shadow-xl border border-base-300 overflow-hidden grid lg:grid-cols-[1.1fr,0.9fr]"
    >
      <!-- form -->
      <div class="order-2 lg:order-1 p-8 md:p-10">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-extrabold">ورود با کد یکبار مصرف</h1>
          <RouterLink to="/register" class="text-sm link">ثبت‌نام ندارید؟</RouterLink>
        </div>

        <!-- STEP 1: ask phone -->
        <div v-if="step === 1" class="space-y-4">
          <p class="text-sm opacity-70">
            شماره موبایل خود را وارد کنید تا برای شما کد تایید ارسال شود.
          </p>
          <label class="form-control">
            <span class="label-text mb-1">شماره موبایل</span>
            <div class="join w-full">
              <input
                  v-model="phone"
                  type="tel"
                  placeholder="مثلاً 0912xxxxxxx"
                  class="input input-bordered join-item w-full"
              />
              <span class="btn btn-ghost join-item" disabled>+98</span>
            </div>
          </label>
          <button
              class="btn btn-primary w-full"
              :disabled="!isPhoneValid || loading"
              @click="sendCode"
          >
            {{ loading ? 'در حال ارسال...' : 'ارسال کد تایید' }}
          </button>
        </div>

        <!-- STEP 2: enter code -->
        <div v-else class="space-y-5">
          <p class="text-sm opacity-70">
            کد ۶ رقمی ارسال شده به
            <strong dir="ltr" class="font-mono">{{ prettyPhone }}</strong>
            را وارد کنید.
          </p>

          <div class="flex gap-2 justify-center otp-boxes" dir="ltr">
            <input
                v-for="(d, idx) in 6"
                :key="idx"
                ref="otpInputs"
                maxlength="1"
                type="text"
                class="input input-bordered w-12 h-12 text-center text-lg otp-input"
                v-model="otp[idx]"
                @input="onOtpInput(idx)"
                @keydown.backspace.prevent="onBackspace(idx)"
            />
          </div>

          <button
              class="btn btn-primary w-full"
              :disabled="otp.join('').length !== 6 || verifying"
              @click="verify"
          >
            {{ verifying ? 'در حال ورود...' : 'تایید و ورود' }}
          </button>

          <div class="flex items-center justify-between text-xs opacity-70">
            <button class="link" @click="reset">اصلاح شماره</button>
            <button
                class="link"
                :disabled="resendSeconds > 0"
                @click="sendCode"
            >
              {{ resendSeconds > 0 ? `ارسال مجدد در ${resendSeconds}ث` : 'ارسال مجدد کد' }}
            </button>
          </div>
        </div>

        <p class="text-xs opacity-60 mt-6">
          با ورود، قوانین و حریم خصوصی را می‌پذیرید.
        </p>
      </div>

      <!-- branding -->
      <div
          class="order-1 lg:order-2 bg-gradient-to-b from-primary/90 to-primary/40 text-base-100 p-8 md:p-10 flex flex-col justify-between"
      >
        <div>
          <p class="text-sm opacity-80 mb-2">به MithraPay خوش آمدید</p>
          <h2 class="text-xl font-bold mb-3">ورود سریع بدون رمز عبور</h2>
          <p class="text-sm text-base-100/80 leading-6">
            فقط شماره موبایل را وارد کنید و با کد یکبار مصرف وارد شوید.
          </p>
        </div>
        <div class="text-xs text-base-100/70" >
          پشتیبانی: 09171004008
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import authBg from '@/assets/auth-bg.png' // 👈 background
import { requestOtp, verifyOtp } from '@/services/api'   // 👈 add this
import { useAuthStore } from '@/stores/auth'
import { useToast } from "vue-toastification"
const toast = useToast()

const auth = useAuthStore()
const router = useRouter()

const step = ref<1 | 2>(1)
const phone = ref('')
const otp = ref<string[]>(['', '', '', '', '', ''])
const loading = ref(false)
const verifying = ref(false)
const resendSeconds = ref(0)
const otpInputs = ref<HTMLInputElement[]>([] as any)

const isPhoneValid = computed(() => /^09\d{9}$/.test(phone.value))
const prettyPhone = computed(() =>
    phone.value.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3')
)

function startResendTimer() {
  resendSeconds.value = 45
  const timer = setInterval(() => {
    resendSeconds.value--
    if (resendSeconds.value <= 0) clearInterval(timer)
  }, 1000)
}

async function sendCode() {
  if (!isPhoneValid.value) return
  loading.value = true

  try {
    // call backend
    await requestOtp(phone.value)

    step.value = 2
    startResendTimer()

    await nextTick()
    otpInputs.value?.[0]?.focus()
  } catch (err: any) {
    console.error(err)
    alert(err?.response?.data?.message || 'خطا در ارسال کد تأیید')
  } finally {
    loading.value = false
  }
}

function onOtpInput(idx: number) {
  const v = otp.value[idx]
  otp.value[idx] = v.replace(/\D/g, '').slice(0, 1)
  if (otp.value[idx] && idx < 5) {
    otpInputs.value?.[idx + 1]?.focus()
  }
}

function onBackspace(idx: number) {
  if (otp.value[idx]) {
    otp.value[idx] = ''
    return
  }
  if (idx > 0) {
    otpInputs.value?.[idx - 1]?.focus()
    otp.value[idx - 1] = ''
  }
}

function reset() {
  step.value = 1
  otp.value = ['', '', '', '', '', '']
}

async function verify() {
  const code = otp.value.join('')
  if (code.length !== 6) return

  verifying.value = true
  try {
    const data = await verifyOtp(phone.value, code)

    const token = data.access_token || data.token
    const user = data.user || { phone: phone.value }

    if (!token) {
      throw new Error('توکن از سرور برنگشت')
    }

    // Save in auth store (this also updates localStorage)
    auth.login({ token, user })

    toast.success('ورود با موفقیت انجام شد')
    router.push('/')   // redirect to home
  } catch (err: any) {
    console.error(err)
    toast.error(err?.response?.data?.message || 'کد وارد شده صحیح نیست')
  } finally {
    verifying.value = false
  }
}



</script>

<style scoped>
.otp-boxes {
  direction: ltr !important;
}

.otp-input {
  direction: ltr !important;
  unicode-bidi: plaintext; /* force natural LTR ordering */
}
</style>
