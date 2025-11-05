<template>
  <div
      class="min-h-screen flex items-center justify-center px-4 py-10 bg-base-200"
      :style="{
      backgroundImage: `url(${authBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <!-- optional overlay to make card readable -->
    <div class="absolute inset-0 bg-base-200/70 pointer-events-none"></div>

    <div
        class="relative w-full max-w-3xl bg-base-100/95 backdrop-blur-sm rounded-3xl shadow-xl border border-base-300 overflow-hidden grid lg:grid-cols-[1.1fr,0.9fr]"
    >
      <!-- form -->
      <div class="order-2 lg:order-1 p-8 md:p-10">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-extrabold">ساخت حساب با کد یکبار مصرف</h1>
          <RouterLink to="/login" class="text-sm link">قبلاً حساب دارید؟</RouterLink>
        </div>

        <!-- STEP 1 -->
        <div v-if="step === 1" class="space-y-4">
          <p class="text-sm opacity-70">
            شماره موبایل را وارد کنید تا کد تایید برایتان ارسال شود.
          </p>
          <label class="form-control">
            <span class="label-text mb-1">شماره موبایل</span>
            <input
                v-model="phone"
                type="tel"
                class="input input-bordered"
                placeholder="0912xxxxxxx"
            />
          </label>
          <button
              class="btn btn-primary w-full"
              :disabled="!isPhoneValid || loading"
              @click="sendCode"
          >
            ارسال کد تایید
          </button>
        </div>

        <!-- STEP 2 -->
        <div v-else class="space-y-5">
          <p class="text-sm opacity-70">
            کد ارسال شده به {{ phone }} را وارد کنید و نام خود را تکمیل کنید.
          </p>

          <div class="flex gap-2 justify-center">
            <input
                v-for="(d, idx) in 6"
                :key="idx"
                ref="otpInputs"
                maxlength="1"
                type="text"
                class="input input-bordered w-12 h-12 text-center text-lg"
                v-model="otp[idx]"
                @input="onOtpInput(idx)"
                @keydown.backspace.prevent="onBackspace(idx)"
            />
          </div>

          <label class="form-control">
            <span class="label-text mb-1">نام و نام خانوادگی</span>
            <input
                v-model="fullName"
                type="text"
                class="input input-bordered"
                placeholder="مثلاً سروش محمدی"
            />
          </label>

          <button
              class="btn btn-primary w-full"
              :disabled="otp.join('').length !== 6 || !fullName"
              @click="complete"
          >
            تکمیل ثبت‌نام
          </button>

          <div class="flex items-center justify-between text-xs opacity-70">
            <button class="link" @click="reset">اصلاح شماره</button>
            <button class="link" :disabled="resendSeconds > 0" @click="sendCode">
              {{ resendSeconds > 0 ? `ارسال مجدد در ${resendSeconds}ث` : 'ارسال مجدد کد' }}
            </button>
          </div>
        </div>
      </div>

      <!-- branding -->
      <div
          class="order-1 lg:order-2 bg-gradient-to-b from-secondary/90 to-secondary/40 text-base-100 p-8 md:p-10 flex flex-col justify-between"
      >
        <div>
          <h2 class="text-xl font-bold mb-3">عضویت سریع</h2>
          <p class="text-sm text-base-100/80 leading-6">
            بدون رمز عبور، فقط با موبایل. مناسب مشتری‌های تکراری و خریدهای سریع.
          </p>
        </div>
        <p class="text-xs text-base-100/60">پشتیبانی همیشه در دسترس.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import authBg from '@/assets/auth-bg.png' // 👈 your background

const router = useRouter()
const step = ref<1 | 2>(1)
const phone = ref('')
const fullName = ref('')
const otp = ref(['', '', '', '', '', ''])
const otpInputs = ref<HTMLInputElement[]>([] as any)
const loading = ref(false)
const resendSeconds = ref(0)

const isPhoneValid = computed(() => /^09\d{9}$/.test(phone.value))

function startResend() {
  resendSeconds.value = 45
  const t = setInterval(() => {
    resendSeconds.value--
    if (resendSeconds.value <= 0) clearInterval(t)
  }, 1000)
}

function sendCode() {
  if (!isPhoneValid.value) return
  loading.value = true
  setTimeout(() => {
    loading.value = false
    step.value = 2
    startResend()
    nextTick(() => otpInputs.value?.[0]?.focus())
  }, 700)
}

function onOtpInput(idx: number) {
  otp.value[idx] = otp.value[idx].replace(/\D/g, '').slice(0, 1)
  if (otp.value[idx] && idx < 5) {
    otpInputs.value?.[idx + 1]?.focus()
  }
}
function onBackspace(idx: number) {
  if (otp.value[idx]) {
    otp.value[idx] = ''
  } else if (idx > 0) {
    otpInputs.value?.[idx - 1]?.focus()
    otp.value[idx - 1] = ''
  }
}

function reset() {
  step.value = 1
  otp.value = ['', '', '', '', '', '']
}

function complete() {
  // TODO: call backend register
  router.push('/')
}
</script>
