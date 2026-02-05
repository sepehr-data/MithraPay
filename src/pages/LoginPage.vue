<template>
  <div
      class="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden"
      :style="{
      backgroundImage: `url(${authBg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'left center',
    }"
  >
    <!-- overlay (prettier + safe for clicks) -->
    <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-br from-base-200/70 via-base-200/35 to-base-300/60"
    ></div>
    <div class="pointer-events-none absolute inset-0 backdrop-blur-[2px]"></div>

    <div
        class="relative w-full max-w-4xl rounded-3xl border border-base-300/60 bg-base-100/80 backdrop-blur-xl shadow-2xl overflow-hidden grid lg:grid-cols-[1fr,1fr]"
    >
      <!-- branding -->
      <div
          class="order-1 lg:order-2 relative p-8 md:p-10 text-base-100 overflow-hidden flex flex-col justify-between"
      >
        <!-- background gradient blob -->
        <div class="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/75 to-secondary/55"></div>
        <div class="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-base-100/10 blur-2xl"></div>
        <div class="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-base-100/10 blur-2xl"></div>

        <div class="relative">
          <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-100/10 border border-base-100/15 text-xs mb-5"
          >
            <span class="w-2 h-2 rounded-full bg-success"></span>
            ورود امن با کد یکبار مصرف
          </div>

          <h2 class="text-2xl md:text-3xl font-extrabold leading-9 mb-3">خوش آمدید به RedSkyBox</h2>

          <p class="text-sm md:text-base text-base-100/80 leading-7 max-w-sm">
            فقط شماره موبایل را وارد کنید و بدون رمز عبور، سریع وارد شوید.
          </p>

          <!-- ✅ Image under the text -->
          <div class="mt-6">
            <img
                :src="loginIllustration"
                alt="login illustration"
                class="w-full max-w-sm mx-auto lg:mx-0 select-none pointer-events-none object-contain max-h-56 drop-shadow-[0_18px_40px_rgba(0,0,0,0.25)] opacity-95"
            />
          </div>
        </div>

        <div class="relative text-xs text-base-100/80 flex items-center justify-between">
          <span>پشتیبانی: 09171004008</span>
          <span class="opacity-80">RedSkyBox ©</span>
        </div>
      </div>

      <!-- form -->
      <div class="order-2 lg:order-1 p-7 sm:p-8 md:p-10">
        <div class="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 class="text-2xl font-extrabold">ورود</h1>
            <p class="text-sm opacity-70 mt-1">با کد یکبار مصرف وارد شوید</p>
          </div>
        </div>

        <!-- step indicator -->
        <div class="flex items-center gap-2 mb-7">
          <div
              class="flex items-center gap-2 px-3 py-2 rounded-2xl border"
              :class="step === 1 ? 'border-primary/40 bg-primary/5' : 'border-base-300 bg-base-200/50'"
          >
            <span
                class="w-6 h-6 rounded-full grid place-items-center text-xs font-bold"
                :class="step === 1 ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/70'"
            >1</span
            >
            <span class="text-xs font-semibold">شماره</span>
          </div>

          <div class="flex-1 h-px bg-base-300/80"></div>

          <div
              class="flex items-center gap-2 px-3 py-2 rounded-2xl border"
              :class="step === 2 ? 'border-primary/40 bg-primary/5' : 'border-base-300 bg-base-200/50'"
          >
            <span
                class="w-6 h-6 rounded-full grid place-items-center text-xs font-bold"
                :class="step === 2 ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/70'"
            >2</span
            >
            <span class="text-xs font-semibold">کد</span>
          </div>
        </div>

        <transition name="fade-slide" mode="out-in">
          <!-- STEP 1 -->
          <div v-if="step === 1" key="s1" class="space-y-4">
            <label class="form-control">
              <span class="label-text mb-1">شماره موبایل</span>

              <div class="relative">
                <span class="absolute inset-y-0 left-3 flex items-center text-xs opacity-60">+98</span>
                <input
                    v-model="phone"
                    type="tel"
                    inputmode="numeric"
                    class="input input-bordered w-full pl-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <span class="text-[11px] opacity-60 mt-2"> مثال: 09123456789 </span>
            </label>

            <button
                class="btn btn-primary w-full rounded-2xl shadow-lg shadow-primary/15"
                :disabled="!isPhoneValid || loading"
                @click="sendCode"
            >
              <span class="loading loading-spinner loading-sm" v-if="loading"></span>
              <span v-else>ارسال کد تایید</span>
            </button>
          </div>

          <!-- STEP 2 -->
          <div v-else key="s2" class="space-y-5">
            <div class="rounded-2xl bg-base-200/60 border border-base-300 p-4">
              <p class="text-sm opacity-75">
                کد ۶ رقمی ارسال شده به <strong dir="ltr" class="font-mono">{{ prettyPhone }}</strong> را وارد کنید.
              </p>
            </div>

            <div class="flex gap-2 justify-center otp-boxes" dir="ltr" @paste.prevent="onOtpPaste">
              <input
                  v-for="(_, idx) in 6"
                  :key="idx"
                  ref="otpInputs"
                  maxlength="1"
                  type="text"
                  inputmode="numeric"
                  class="input input-bordered w-12 h-12 md:w-13 md:h-13 text-center text-lg rounded-2xl otp-input focus:outline-none focus:ring-2 focus:ring-primary/30"
                  v-model="otp[idx]"
                  @input="onOtpInput(idx)"
                  @keydown.backspace.prevent="onBackspace(idx)"
              />
            </div>

            <button
                class="btn btn-primary w-full rounded-2xl shadow-lg shadow-primary/15"
                :disabled="otp.join('').length !== 6 || verifying"
                @click="verify"
            >
              <span class="loading loading-spinner loading-sm" v-if="verifying"></span>
              <span v-else>تایید و ورود</span>
            </button>

            <div class="flex items-center justify-between text-xs opacity-75">
              <button class="link link-hover" @click="reset">اصلاح شماره</button>

              <button class="link link-hover" :disabled="resendSeconds > 0 || loading" @click="sendCode">
                <span v-if="resendSeconds > 0">
                  ارسال مجدد در <span class="font-mono">{{ resendSeconds }}</span
                >ث
                </span>
                <span v-else>ارسال مجدد کد</span>
              </button>
            </div>
          </div>
        </transition>

        <p class="text-xs opacity-60 mt-7 leading-6">با ورود، قوانین و حریم خصوصی را می‌پذیرید.</p>
      </div>
    </div>

    <AdminKnockModal v-model:open="isOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onBeforeUnmount } from "vue"
import authBg from "@/assets/auth-bg.png"
import loginIllustration from "@/assets/branding-bg.png"

// ✅ از api client جدید
import { requestOtp, verifyOtp } from "@/services/auth"

import { useAuthStore } from "@/stores/auth"
import { useToast } from "vue-toastification"
import AdminKnockModal from "@/components/AdminKnockModal.vue"
import { useAdminKnock } from "@/composables/useAdminKnock"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

const { isOpen } = useAdminKnock()
const toast = useToast()
const auth = useAuthStore()

const step = ref<1 | 2>(1)
const phone = ref("")
const otp = ref<string[]>(["", "", "", "", "", ""])
const loading = ref(false)
const verifying = ref(false)
const resendSeconds = ref(0)
const otpInputs = ref<HTMLInputElement[]>([] as any)

const isPhoneValid = computed(() => /^09\d{9}$/.test(phone.value))
const prettyPhone = computed(() => phone.value.replace(/(\d{4})(\d{3})(\d{4})/, "$1-$2-$3"))

let resendTimer: number | null = null

function startResendTimer() {
  resendSeconds.value = 45
  if (resendTimer) window.clearInterval(resendTimer)
  resendTimer = window.setInterval(() => {
    resendSeconds.value--
    if (resendSeconds.value <= 0 && resendTimer) {
      window.clearInterval(resendTimer)
      resendTimer = null
    }
  }, 1000)
}

onBeforeUnmount(() => {
  if (resendTimer) window.clearInterval(resendTimer)
})

function normalizeErrMessage(err: any) {
  return (
      err?.message ||
      err?.msg ||
      err?.detail ||
      err?.error ||
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      "خطای نامشخص"
  )
}

async function sendCode() {
  if (!isPhoneValid.value || loading.value) return
  loading.value = true

  try {
    await requestOtp({ phone: phone.value })

    step.value = 2
    startResendTimer()

    await nextTick()
    otp.value = ["", "", "", "", "", ""]
    otpInputs.value?.[0]?.focus()

    toast.success("کد تایید ارسال شد")
  } catch (err: any) {
    console.error(err)
    toast.error(normalizeErrMessage(err) || "خطا در ارسال کد تأیید")
  } finally {
    loading.value = false
  }
}

function onOtpInput(idx: number) {
  const v = otp.value[idx] || ""
  otp.value[idx] = v.replace(/\D/g, "").slice(0, 1)
  if (otp.value[idx] && idx < 5) otpInputs.value?.[idx + 1]?.focus()
}

function onBackspace(idx: number) {
  if (otp.value[idx]) {
    otp.value[idx] = ""
    return
  }
  if (idx > 0) {
    otpInputs.value?.[idx - 1]?.focus()
    otp.value[idx - 1] = ""
  }
}

function onOtpPaste(e: ClipboardEvent) {
  const text = (e.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, 6)
  if (text.length === 0) return

  otp.value = text.split("").concat(Array(6 - text.length).fill(""))
  nextTick(() => otpInputs.value?.[Math.min(text.length, 5)]?.focus())
}

function reset() {
  step.value = 1
  otp.value = ["", "", "", "", "", ""]
}

async function afterLoginSuccess() {
  const redirect = typeof route.query.redirect === "string" ? route.query.redirect : "/"
  await router.replace(redirect)
}

async function verify() {
  const code = otp.value.join("")
  if (code.length !== 6 || verifying.value) return

  verifying.value = true
  try {
    const data = await verifyOtp({ phone: phone.value, code })

    const token = data?.access_token
    if (!token) throw new Error("توکن از سرور برنگشت")

    // ✅ store خودش token + roles رو ذخیره می‌کنه
    auth.login({ token, user: { phone: phone.value } })

    toast.success("ورود با موفقیت انجام شد")
    await afterLoginSuccess()
  } catch (err: any) {
    console.error(err)
    toast.error(normalizeErrMessage(err) || "کد وارد شده صحیح نیست")
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
  unicode-bidi: plaintext;
}

/* small, modern transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
